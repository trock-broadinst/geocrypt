import styles from "@/styles/Home.module.css";
import { Message } from "@/utils/sidecar/helpers";
import Messages from "@/utils/sidecar/messages";
import { BlobReader } from "@zip.js/zip.js";
import "core-js";
import { DataConnection, Peer, util } from "peerjs";
import React, { useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { FileUploader } from "react-drag-drop-files";
import streamSaver from "streamsaver";

type FileMetaData = { name: string; size: number };

type ChatMessage = { msgType: "chat_message"; text: string };
type FileOfferMessage = { msgType: "file_offer"; files: FileMetaData[] }; // TODO: later maybe hash
type FileRequestMessage = { msgType: "file_request"; fileName: string };
type FileDataMessage = {
  msgType: "file_data";
  name: string;
  data: string;
  lastData: boolean;
};

type ChannelMessage =
  | FileOfferMessage
  | FileRequestMessage
  | FileDataMessage
  | ChatMessage;

const serverConfig = {
  iceServers: [
    { urls: "stun:46.165.240.76:3478" },
    { urls: "stun:108.61.211.199:3478" },
    {
      urls: "turn:46.165.240.76:3478",
      credential: "asperTinO1",
      username: "otrto",
    },
    {
      urls: "turn:108.61.211.199:3478",
      credential: "asperTinO1",
      username: "otrto",
    },
  ],
};

function useExtendedState<T>(initialState: T) {
  const [state, setState] = React.useState<T>(initialState);
  const getLatestState = () =>
    new Promise<T>((resolve) => {
      setState((s) => {
        resolve(s);
        return s;
      });
    });

  return [state, setState, getLatestState] as const;
}

const browserSupported = () => util.supports.data === false; // TODO: throw error if not supported

const fileDedupe = (
  v: File | FileMetaData,
  i: number,
  a: (File | FileMetaData)[]
) => v.name && v.name !== "" && a.findIndex((t) => t.name === v.name) === i;

const generateID = () => {
  // Source: https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
  const S4 = () => Math.random().toString(36).substring(2, 15);
  return `${S4()}-${S4()}-${S4()}`;
};
const fancyBytes = (bytes: number) => {
  const size = Math.floor(bytes / 1e6);
  return size < 1 ? `${Math.floor(bytes / 1e3)}Kb` : `${size}Mb`;
};

export default function Client() {
  // TODO: read reciepts
  const [messages, setMessages] = React.useState<Message[]>([]);

  // const [filesOffering, setFilesOffering] = React.useState<File[]>([]);
  const [filesOffering, setFilesOffering, getFilesOffering] = useExtendedState<
    File[]
  >([]);
  const [filesOffered, setFilesOffered] = React.useState<FileMetaData[]>([]);
  const [allWritables, setAllWritables, getAllWritables] = useExtendedState<{
    [key: string]: any;
  }>({});

  // const [conns, setConns] = React.useState<DataConnection[]>([]);
  const [conn, setConn] = React.useState<DataConnection | null>(null);
  const [peerId] = React.useState<string>(generateID());
  const [wasCopied, setWasCopied] = React.useState<boolean>(false);
  const bootstrapped = React.useRef<boolean>(null);

  const messageBox = React.useRef<HTMLInputElement>(null);

  const sendAll = (msg: ChannelMessage) => {
    // TODO: encryption chokepoint
    console.log("Send all", msg);
    if (conn) conn.send(msg);
  };

  const buildFileSink = (fileName: string) =>
    new WritableStream({
      // Implement the sink
      write(chunk) {
        const dataSend: FileDataMessage = {
          // TODO: implement UUID system, should be non-blocking, or at least queueing
          msgType: "file_data",
          name: fileName,
          data: chunk.toString(),
          lastData: false,
        };
        sendAll(dataSend);
      },
      close() {
        const dataSend: FileDataMessage = {
          msgType: "file_data",
          name: fileName,
          data: "",
          lastData: true,
        };
        sendAll(dataSend);
      },
      abort(err) {
        alert(`File send aborted: ${err.message}`);
      },
    });

  const sendFileOffer = (toOffer: File[]) => {
    const fileMeta = toOffer.map((file) => ({
      name: file.name,
      size: file.size,
    }));
    console.log("Send file offer", fileMeta);
    sendAll({ msgType: "file_offer", files: fileMeta });
  };

  const saveMessage = (message: Message) => {
    setMessages((prevmsgs) => [...prevmsgs, message]);
  };

  const handleMessage = async (msg: ChannelMessage) => {
    if (!msg) {
      console.error("No message to handle");
      return;
    }
    if (typeof msg !== "object") {
      console.log(`Non-object message: ${msg}`);
      return;
    }

    console.log("Handle message", msg);

    const { msgType } = msg;
    switch (msgType) {
      case "chat_message":
        saveMessage(new Message(msg.text, false));
        break;
      case "file_offer":
        // New file offer
        console.log("Handle file offer");
        if (!msg.files) {
          console.error("File offer has no field 'files'");
        }
        setFilesOffered(() => msg.files.filter(fileDedupe));
        break;
      case "file_request":
        console.log("Handle file request");
        if (!msg.fileName) {
          console.error("File offer has no field 'fileName'");
        } else {
          await getFilesOffering().then(async (filesOfferCurrent) => {
            const desiredFile = filesOfferCurrent.find(
              (f) => f.name === msg.fileName
            );
            if (!desiredFile) {
              console.error("File not found");
              return;
            }
            console.log("Sending file");
            console.log(desiredFile);
            await new BlobReader(desiredFile).readable.pipeTo(
              // TODO: why whyWHY WHY whyyyyyy wowowooowwwwnntttt hthis wooorkk!??!!?!?!!!!
              buildFileSink(desiredFile.name)
            );
            // const fileStreamer = new FileStreamer(desiredFile);
            // while (!fileStreamer.isEndOfFile()) {
            //   console.log("Sending file chunk");
            //   // eslint-disable-next-line no-await-in-loop
            //   await fileStreamer.readBlockAsText().then((fileString) => {
            //     console.log("Send file chunk", fileString.length);
            // sendAll({
            //   // TODO: implement UUID system
            //   msgType: "file_data",
            //   name: desiredFile.name,
            //   data: fileString,
            //   lastData: fileStreamer.isEndOfFile(),
            // });
            //   });
            // }
          });
        }
        break;
      case "file_data":
        console.log("Handle chunked file data");
        getAllWritables().then((fetchedWritables) => {
          if (!fetchedWritables || !(msg.name in fetchedWritables)) {
            // TODO: request succeeds, but no file is written
            const writableStream = streamSaver
              .createWriteStream(msg.data)
              .getWriter(); // TODO: supply size somehow
            setAllWritables((prev) => ({
              ...prev,
              [msg.name]: writableStream,
            }));
            writableStream.write(msg.data);
          } else {
            const writableStream = fetchedWritables[msg.name];
            writableStream.write(msg.data);
            if (msg.lastData) {
              writableStream.close(); // async
            }
          }
        });
        break;
      default:
        console.error(`Unrecognised msg type: ${msgType}`);
    }
  };

  const addFile = (fileMeta: File[]) => {
    setFilesOffering((prevFiles) => {
      const filesNew = [...prevFiles, ...Array.from(fileMeta)].filter(
        fileDedupe
      );
      sendFileOffer(filesNew);
      return filesNew;
    });
  };

  const deleteFile = (filename: string) =>
    setFilesOffering((prevFiles) => {
      const newFiles = prevFiles.filter((file) => file.name !== filename);
      sendFileOffer(newFiles);
      return newFiles;
    });

  const requestDownload = (fileName: string) => {
    const targetFile = filesOffered.find((file) => file.name === fileName);
    if (targetFile) {
      console.log("Request file download");
      const request: FileRequestMessage = {
        msgType: "file_request",
        fileName: targetFile.name,
      };
      sendAll(request);
    }
  };

  const connect = (thisPeer: Peer, targetPeerId: string) => {
    thisPeer.on("open", (id) => {
      saveMessage(new Message(`Created Peer: ${id}`, true, true));

      const newConnection = thisPeer.connect(targetPeerId);

      newConnection.on("open", () => {
        saveMessage(
          new Message(`Connected to Peer: ${targetPeerId}`, true, true)
        );
        setConn(newConnection);

        newConnection.on("data", (data) =>
          handleMessage(data as ChannelMessage)
        );
      });

      newConnection.on("error", (error) => console.log("error", error));

      // setTimeout(() => { //TODO: do a better job with this, could probab
      //   if (bootstrapped.current && conn === null) {
      //     saveMessage(new Message("Peer not found", true, true));
      //     window.location.href = window.location.origin;
      //   }
      // }, 20000);

      newConnection.on("close", () =>
        saveMessage(new Message("Peer has left the chat", true, true))
      );
    });
  };

  const createPeer = (id: string): Peer => {
    const thisPeer = new Peer(id, { config: serverConfig });

    thisPeer.on("connection", (newConnection) => {
      console.log("open", thisPeer.connections);
      saveMessage(new Message("Connected to Peer", true, true));
      setConn(newConnection);

      newConnection.on("data", (data) => {
        console.log("data", data);
        console.log(messages);
        handleMessage(data as ChannelMessage);
      });

      newConnection.on("close", () =>
        saveMessage(new Message("Peer has left the chat", true, true))
      );
    });

    thisPeer.on("error", (error) => console.log("error", error));

    return thisPeer;
  };

  useEffect(() => {
    if (!bootstrapped.current) {
      // @ts-ignore
      bootstrapped.current = true;
      console.log("peerId", peerId);

      const targetPeerId = window.top && window.top.location.hash.substr(1);
      if (targetPeerId && targetPeerId !== "") {
        console.log("connectPeer", peerId, targetPeerId);
        connect(new Peer(peerId, { config: serverConfig }), targetPeerId);
      } else {
        console.log("createPeer", peerId);
        createPeer(peerId);
      }
    }
  }, [bootstrapped]);

  const sendMessage = () => {
    if (
      messageBox.current?.value &&
      messageBox.current?.value.trim() !== "" &&
      conn
    ) {
      saveMessage(new Message(messageBox.current?.value, true));
      sendAll({
        msgType: "chat_message",
        text: messageBox.current?.value,
      });
      messageBox.current.value = "";
    }
  };

  return (
    <div style={{ marginBottom: "4rem" }}>
      {conn ? (
        <div className={styles.card}>
          <Messages messages={messages} />
          <div className={styles.card}>
            <input
              ref={messageBox}
              className={styles.textbox}
              name="userInput"
              type="text"
              autoComplete="off"
              placeholder="Type your message"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button
              className={styles.bigbutton}
              onClick={sendMessage}
              type="button"
            >
              send
            </button>
          </div>

          <FileUploader multiple required handleChange={addFile} name="file">
            <div className={styles.uploadbox}>Drag &amp; Drop files here</div>
          </FileUploader>
          <br />
          <div className={styles.filelistcontainer}>
            {filesOffering.length > 0 &&
              filesOffering.map((file) => (
                <div className={styles.filelistbox} key={file.name}>
                  {file.name} <p>{fancyBytes(file.size)} </p>
                  <button
                    type="button"
                    className={styles.bigbutton}
                    style={{ padding: "0.3em" }}
                    onClick={() => deleteFile(file.name)}
                  >
                    ✖
                  </button>
                  <hr />
                </div>
              ))}
          </div>

          {filesOffered.length > 0 && ( // TODO: this is just a temp dl progress display
            <div className={styles.card}>
              <h1>Downloads available</h1>
              <div className={styles.filelistcontainer}>
                {filesOffered.map((key) => (
                  <button
                    key={key.name + key.size}
                    className={styles.bigbutton}
                    style={{ textAlign: "center" }}
                    onClick={() => requestDownload(key.name)}
                    type="button"
                  >
                    {key.name} ({fancyBytes(key.size)})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.card}>
          <h1>Start chatting</h1>
          <h3>
            To start a chat just send the following link to the desired person:
          </h3>

          {peerId && (
            <>
              <input
                className={styles.textbox}
                value={`${window.location.origin}/sidecar#${peerId}`}
                readOnly
              />
              <CopyToClipboard
                text={`${window.location.origin}/sidecar#${peerId}`}
                onCopy={() => setWasCopied(true)}
              >
                {wasCopied ? (
                  <button
                    className={styles.bigbutton}
                    style={{ borderRadius: "0 4px 4px 0" }}
                    type="button"
                  >
                    <span>Copied!</span>
                  </button>
                ) : (
                  <button
                    className={styles.bigbutton}
                    style={{ borderRadius: "0 4px 4px 0" }}
                    type="button"
                  >
                    Copy link
                  </button>
                )}
              </CopyToClipboard>
            </>
          )}
        </div>
      )}
    </div>
  );
}
