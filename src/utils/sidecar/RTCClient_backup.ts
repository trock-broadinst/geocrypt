import FileStreamer from "@/utils/sidecar/fileStreamer";
import { Message } from "@/utils/sidecar/helpers";
import { DataConnection, Peer } from "peerjs";

export type FileMetaData = { name: string; size: number };

export type ChatMessage = { msgType: "chat_message"; text: string };
export type FileOfferMessage = { msgType: "file_offer"; files: FileMetaData[] }; // TODO: later maybe hash
export type FileRequestMessage = { msgType: "file_request"; fileName: string };
export type FileDataMessage = {
  msgType: "file_data";
  data: string;
  lastData: boolean;
};

type ChannelMessage =
  | FileOfferMessage
  | FileRequestMessage
  | FileDataMessage
  | ChatMessage;

export default class Client {
  peer: Peer | null;

  id: string;

  conns: DataConnection[];

  files: { [name: string]: File };

  offered_files: FileMetaData[];

  writable: any | null; // TODO: typeme

  filesChangedCallback: Function;

  offeredFilesChangedCallback: Function;// TODO: should be a way to retract this

  messagesChangedCallback: Function;

  constructor(
    id: string,
    messagesChangedCallback: Function,
    offeredFilesChangedCallback: Function,
    filesChangedCallback: Function
  ) {
    this.id = id || Client.generateID();
    this.peer = null;
    this.conns = [];

    // key: file name, value: file object
    this.files = {};
    this.offered_files = []; // todo object (?)
    this.writable = null;

    this.filesChangedCallback = filesChangedCallback;
    this.offeredFilesChangedCallback = offeredFilesChangedCallback;
    this.messagesChangedCallback = messagesChangedCallback;

    console.log("Client initiated");
  }

  async init_peer(config?: {
    iceServers: {
      urls: string;
      credential?: string;
      username?: string;
    }[];
  }) {
    return new Promise<void>((resolve, reject) => {
      this.peer = new Peer(this.id, { config });

      // Connection to brokering server estabilished
      this.peer.on("open", (id) => {
        this.messagesChangedCallback(
          new Message(`Created Peer: ${id}`, true, true)
        );
        console.log(`My peer ID is: ${id}`);
        resolve();
      });

      // Passive connection opened
      this.peer.on("connection", (conn) => {
        console.log("3 Received new connection:");
        console.dir(conn);
        const clientRef = this;

        this.conns.push(conn);
        conn.on("data", (data) => {
          console.log("2 Received", data);
          clientRef.handleMessage(data as ChannelMessage);
        });

        conn.on("open", () => {
          // Send file offer
          console.log("Send file offer");
          this.sendFileOffer();
        });
      });

      this.peer.on("error", (err) => {
        console.log("Error");
        console.dir(err);
        reject();
      });

      console.log("Peer initiated");
    });
  }

  addFile(fileMeta: File) {
    console.dir(fileMeta);
    if (!("name" in fileMeta)) {
      console.error(`Adding wrong object into file list`);
      return;
    }
    this.files[fileMeta.name] = fileMeta;
    this.filesChangedCallback(this.files);
  }

  deleteFile(filename: string) {
    delete this.files[filename];
    this.filesChangedCallback(this.files);
  }

  getFileOffer(): FileOfferMessage {
    const fileMeta = Object.values(this.files).map((file) => ({
      name: file.name,
      size: file.size,
    }));
    return { msgType: "file_offer", files: fileMeta };
  }

  sendFileOffer() {
    const offer = this.getFileOffer();
    this.sendAll(offer);
  }

  static generateID() {
    // Source: https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
    const S4 = () => Math.random().toString(36).substring(2, 15);
    return `${S4()}-${S4()}-${S4()}`;
  }

  getStatus() {
    if (this.conns.length === 0) {
      return "No connection";
    }
    const connectionIDs = this.conns.map((conn) => conn.peer);
    return `${this.conns.length} connection(s): ${connectionIDs}`;
  }

  // Connect to peer with id
  // todo callback for connection
  connect(id: string) {
    const clientRef = this;
    if (!this.peer) throw new Error("Peer not initialised");
    const conn = this.peer.connect(id, { reliable: true });
    this.conns.push(conn);

    // On receiving messages
    conn.on("data", async (data) => {
      console.log("4 Received", data);
      console.log(typeof data);
      clientRef.handleMessage(data as ChannelMessage);
    });

    // When connection is estabilished
    conn.on("open", () =>
      this.messagesChangedCallback(
        new Message(`Connected to Peer: ${id}`, true, true)
      )
    );

    conn.on("close", () =>
      this.messagesChangedCallback(
        new Message("Peer has left the chat", true, true)
      )
    );

    conn.on("error", (err) => {
      console.dir(err);
    });
  }

  sendAll(msg: ChannelMessage) {// TODO: encryption chokepoint
    this.conns.forEach((conn) => {
      conn.send(msg);
      console.log("tick");
    });
  }

  requestDownload(fileName: string) {
    const targetFile = this.offered_files.find(
      (file) => file.name === fileName
    );
    if (targetFile) {
      console.log("Request file download");
      const request: FileRequestMessage = {
        msgType: "file_request",
        fileName: targetFile.name,
      };
      this.sendAll(request);
    }
  }

  handleMessage(msg: ChannelMessage) {
    if (!msg) {
      console.error("No message to handle");
      return;
    }
    if (typeof msg !== "object") {
      console.log(`Non-object message: ${msg}`);
      return;
    }

    const { msgType } = msg;
    switch (msgType) {
      case "chat_message":
        if (this.messagesChangedCallback)
          this.messagesChangedCallback(new Message(msg.text, false));
        break;
      case "file_offer":
        // New file offer
        console.log("Handle file offer");
        if (!msg.files) {
          console.error("File offer has no field 'files'");
        }
        this.offered_files = msg.files;
        this.offeredFilesChangedCallback(this.offered_files);
        break;
      case "file_request":
        console.log("Handle file request");
        if (!msg.fileName) {
          console.error("File offer has no field 'fileName'");
        }

        // Lookup file and send it
        Object.values(this.files).forEach((file) => {
          if (msg.fileName === file.name) {
            console.log("Sending file");
            const fileStreamer = new FileStreamer(file);
            while (!fileStreamer.isEndOfFile()) {
              fileStreamer.readBlockAsText().then((fileString) =>
                this.sendAll({
                  msgType: "file_data",
                  data: fileString,
                  lastData: fileStreamer.isEndOfFile(),
                })
              );
            }
          }
        });
        break;
      case "file_data":
        if (this.writable) {
          this.writable?.write(msg.data);
        } else {
          console.error("Writeable not open");
        }

        if (msg.lastData) {
          this.writable.close(); // async
        }
        break;
      default:
        console.error(`Unrecognised msg type: ${msgType}`);
    }
  }
}
