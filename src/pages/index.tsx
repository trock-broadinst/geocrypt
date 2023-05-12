import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import React from "react";
import { vfPart1, vfPart2 } from "@/utils/vaultAssembly_new";
import {
  BlobReader,
  BlobWriter,
  ZipWriter,
  ZipWriterAddDataOptions,
} from "@zip.js/zip.js";
import b64 from "base64-async";
import "core-js";
// import "core-js/features/set-immediate";
import { showSaveFilePicker } from "native-file-system-adapter";
import HandleUpload from "@/utils/uploader";
import HandlePassword from "@/utils/password";
import FlavorText from "@/utils/flavortext";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
    //download stream
    await showSaveFilePicker({
      suggestedName: `geocrypt-${Date.now().toString()}.html`,
      accepts: [{ accept: { "text/html": [".html"] } }],
      excludeAcceptAllOption: false, // default
    })
      .then((fileHandle) => fileHandle.createWritable())
      .then((writableStream) =>
        Promise.all(filePromises)
          .then(() => writableStream.write(vfPart1))
          .then(() => {
            if (!progressBar.current || !cancelButton.current)
              throw new Error("progressBar or cancelButton is null");
            progressBar.current.max = 10;
            progressBar.current.value = 2;
          })
          .then(() => zipWriter.close())
          .then((blob) => blob.arrayBuffer())
          .then((arb) => b64.encode(Buffer.from(arb)))
          .then((wst) => writableStream.write(wst))
          .then(() => {
            if (!progressBar.current || !cancelButton.current)
              throw new Error("progressBar or cancelButton is null");
            progressBar.current.max = 10;
            progressBar.current.value = 8;
          })
          .then(() => writableStream.write(vfPart2))
          .then(() => writableStream.close())
      )
      .then(() => alert("Download complete"))
      .finally(() => setShowProgress(false))
      .catch((err) => {
        setShowProgress(false);
        alert(err);
      });
  };

  return (
    <>
      <Head>
        <title>GeoCrypt</title>
        <meta name="description" content="Encrypt files online free" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/geoCrypt.svg" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Image
          src="/geoCrypt.svg"
          alt="GeoCrypt Logo"
          width={300}
          height={300}
          priority
        />
        <h2>[GEOCRYPT]</h2>
        <h4> Encrypt &amp; Decrypt the easy way</h4>
        <br />
        <div className={styles.card} style={{ width: "20em" }}>
          <br />
          <HandleUpload setFiles={setFiles} files={files} />
          <br />
          <HandlePassword setPassword={setPassword} />
          {showProgress ? (
            <span>
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
        <br />
        <h2 className={styles.description}>
          <div>Warning: it is not advised to use firefox for this website</div>
        </h2>
        <br />
        <FlavorText />
      </main>
    </>
  );
}
