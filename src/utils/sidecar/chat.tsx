import styles from "@/styles/Home.module.css";
import "core-js";
import { DataConnection, Peer } from "peerjs";
import React, { useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Message, generatePeerId } from "./helpers";
import Messages from "./messages";

const config = {
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

const calculateSize = (newFiles: File[]) =>
  newFiles.reduce((a, b) => a + b.size, 0);

const fancyBytes = (bytes: number) => {
  const size = Math.floor(bytes / 1e6);
  return size < 1 ? `${Math.floor(bytes / 1e3)}Kb` : `${size}Mb`;
};

export default function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [connection, setConnection] = React.useState<DataConnection | null>(
    null
  );
  const [peerId, setPeerId] = React.useState<string | undefined>();
  const [wasCopied, setWasCopied] = React.useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = React.useState<{
    [key: string]: number;
  }>({});
  const messageBox = React.useRef<HTMLInputElement>(null);
  const fileBox = React.useRef<HTMLInputElement>(null);

  const saveMessage = (message: Message) => {
    setMessages((prevmsgs) => [...prevmsgs, message]);
  };

  const sendMessage = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!messageBox.current || !fileBox.current) return;
    const message = messageBox.current.value;

    if (connection) {
      if (message) {
        connection.send(message);
        saveMessage(new Message(message, true));
        messageBox.current.value = "";
      }
    }
  };

  const connect = (peer: Peer, targetPeerId: string) => {
    peer.on("open", (id) => {
      saveMessage(new Message(`Created Peer: ${id}`, true, true));

      const newConnection = peer.connect(targetPeerId);

      newConnection.on("open", () => {
        saveMessage(
          new Message(`Connected to Peer: ${targetPeerId}`, true, true)
        );
        setConnection(newConnection);

        newConnection.on("data", (data) =>
          saveMessage(new Message(data as unknown as string, false))
        );
      });

      setTimeout(() => {
        if (connection === null) {
          saveMessage(new Message("Peer not found", true, true));
          window.location.href = "/";
        }
      }, 6000);

      newConnection.on("close", () =>
        saveMessage(new Message("Peer has left the chat", true, true))
      );
    });
  };

  const createPeer = (id: string): Peer => {
    const peer = new Peer(id, { config });

    peer.on("connection", (newConnection) => {
      console.log("open", peer.connections);
      saveMessage(new Message("Connected to Peer", true, true));
      setConnection(newConnection);

      newConnection.on("data", (data) => {
        console.log("data", data);
        console.log(messages);
        saveMessage(new Message(data as unknown as string, false));
      });

      newConnection.on("close", () =>
        saveMessage(new Message("Peer has left the chat", true, true))
      );
    });

    peer.on("error", (error) => console.log("error", error));

    return peer;
  };

  useEffect(() => {
    if (!peerId) {
      const newId = generatePeerId();
      console.log("peerId", peerId);
      const targetPeerId = window.top && window.top.location.hash.substr(1);
      if (targetPeerId && targetPeerId !== "") {
        connect(new Peer(newId, { config }), targetPeerId);
      } else {
        console.log("createPeer", peerId);
        createPeer(newId);
      }
      setPeerId(newId);
    }
  });

  return (
    <div style={{ marginBottom: "4rem" }}>
      {connection && (
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
                if (e.key === "Enter") sendMessage(e);
              }}
            />
            <input type="file" ref={fileBox} />

            <button
              className={styles.bigbutton}
              onClick={sendMessage}
              type="button"
            >
              send
            </button>
          </div>
        </div>
      )}

      {downloadProgress &&
        downloadProgress.length > 0 && ( // TODO: this is just a temp dl progress display
          <div className={styles.card}>
            <h1>Download Progress</h1>
            <div className={styles.filelistcontainer}>
              {Object.keys(downloadProgress).map((key) => (
                <div
                  key={key}
                  className={styles.filelistbox}
                  style={{ textAlign: "center" }}
                >
                  {key}: {Math.floor(downloadProgress[key] * 100)}%
                </div>
              ))}
            </div>
          </div>
        )}

      <div className={styles.card}>
        <h1>Start chatting</h1>
        <h3>
          To start a chat just send the following link to the desired person:
        </h3>

        <input
          className={styles.textbox}
          value={`https://otr.to/#${peerId}`}
          readOnly
        />
        <CopyToClipboard
          text={`https://otr.to/#${peerId}`}
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
      </div>
    </div>
  );
}