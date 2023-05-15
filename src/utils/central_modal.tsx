import styles from "@/styles/Home.module.css";
import React from "react";
import { vaultOpenerSize, vfPart1, vfPart2 } from "@/utils/vaultAssembly";
import {
  BlobReader,
  BlobWriter,
  ZipWriter,
  ZipWriterAddDataOptions,
} from "@zip.js/zip.js";
import b64 from "base64-async";
import HandleUpload from "@/utils/uploader";
import HandlePassword from "@/utils/password";
import streamSaver from "streamsaver";

export default function CentralModal() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [password, setPassword] = React.useState<string | undefined>(undefined);
  const [showProgress, setShowProgress] = React.useState<boolean>(false);
  const progressBar = React.useRef<HTMLProgressElement | null>(null);
  const cancelButton = React.useRef<HTMLButtonElement | null>(null);
  const onRefPb = (node: HTMLProgressElement | null) => {
    if (node) progressBar.current = node;
  };
  const onRefCb = (node: HTMLButtonElement | null) => {
    if (node) cancelButton.current = node;
  };

  //run encryptAndDownload when enter key is pressed
  React.useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") encryptAndDownload();
    };
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  });

  const encryptAndDownload = async () => {
    if (password !== undefined) await setShowProgress(true);
    if (files.length < 1 || !progressBar.current || !cancelButton.current) {
      setShowProgress(false);
      return;
    }

    progressBar.current.value = 0;
    progressBar.current.max = 0;

    const controller = new AbortController();
    const signal = controller.signal;
    cancelButton.current.onclick = () => {
      setShowProgress(false);
      controller.abort("Aborted by user");
    };

    const options: ZipWriterAddDataOptions = {
      password: password,
      signal,
      onstart(max: number) {
        if (progressBar.current) progressBar.current.max = max;
        return undefined;
      },
      onprogress(index: number, max: number) {
        if (progressBar.current) {
          progressBar.current.value = index;
          progressBar.current.max = max;
        }
        return undefined;
      },
    };

    const zipWriter = new ZipWriter(new BlobWriter("application/zip"), {
      bufferedWrite: true,
    });
    const filePromises = files.map(
      (file) => file && zipWriter.add(file.name, new BlobReader(file), options)
    );
    const totalSize = vaultOpenerSize + files.reduce((a, b) => a + b.size, 0);
    //download stream
    const writableStream = streamSaver
      .createWriteStream(`geocrypt-${Date.now().toString()}.html`, {
        size: totalSize,
      })
      .getWriter();
    Promise.all(filePromises)
      .then(() => writableStream.write(new TextEncoder().encode(vfPart1)))
      .then(() => {
        if (!progressBar.current || !cancelButton.current)
          throw new Error("progressBar or cancelButton is null");
        progressBar.current.max = 10;
        progressBar.current.value = 2;
      })
      .then(() => zipWriter.close())
      .then((blob) => blob.arrayBuffer())
      .then((arb) => b64.encode(Buffer.from(arb)))
      .then((wst) => writableStream.write(new TextEncoder().encode(wst)))
      .then(() => {
        if (!progressBar.current || !cancelButton.current)
          throw new Error("progressBar or cancelButton is null");
        progressBar.current.max = 10;
        progressBar.current.value = 8;
      })
      .then(() => writableStream.write(new TextEncoder().encode(vfPart2)))
      .then(() => writableStream.close())
      // .then(() => alert("Download complete"))
      .finally(() => setShowProgress(false))
      .catch((err) => {
        setShowProgress(false);
        alert(err);
      });
  };

  return (
    <>
      <div className={styles.card} style={{ width: "30em" }}>
        <br />
        <HandleUpload setFiles={setFiles} files={files} />
        <br />
        <HandlePassword setPassword={setPassword} />
        {showProgress ? (
          <span style={{ width: "100%" }}>
            <progress ref={onRefPb} className={styles.progressbar}></progress>
            <button ref={onRefCb} className={styles.bigbutton} title="abort">
              ✖
            </button>
          </span>
        ) : (
          <button
            className={styles.bigbutton}
            style={{ width: "100%" }}
            onClick={() => encryptAndDownload()}
          >
            Encrypt files and download
          </button>
        )}
      </div>
    </>
  );
}
