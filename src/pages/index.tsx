import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import React from "react";
import { FileUploader } from "react-drag-drop-files";
import PasswordValidator from "password-validator";
import Link from "next/link";
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
    await setShowProgress(true);
    console.log(password, progressBar.current, cancelButton.current);
    if (password === undefined || !progressBar.current || !cancelButton.current)
      return;

    progressBar.current.value = 0;
    progressBar.current.max = 0;

    const controller = new AbortController();
    const signal = controller.signal;
    cancelButton.current.onclick = () => {
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
        <div className={styles.card}>
          <br />
          <HandleUpload setFiles={setFiles} files={files} />
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

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>
              Secure <span>⤵</span>
            </h2>
            <p>
              Your files will be compressed and encrypted with AES-CTR, an
              industry-standard security algorithm
            </p>
          </div>
          <div className={styles.card}>
            <h2>
              Simple <span>⤵</span>
            </h2>
            <p>
              The emitted HTML file can be decrypted by anyone with a modern
              browser, even offline(once necessary libraries have loaded). Be
              sure to share the password through a secure channel.
            </p>
          </div>
          <div className={styles.card}>
            <h2>
              Is this legal? <span>⤵</span>
            </h2>
            <p>
              Some nations have laws against encryption, such as Australia. We
              don&apos;t care about your location, so use at your own risk. We
              are not responsible for data loss, illegal use, or any other
              damages.
            </p>
          </div>
          <div className={styles.card}>
            <h2>
              How can I support this? <span>⤵</span>
            </h2>
            <Link
              className={styles.link}
              href="https://ko-fi.com/edisys/?hidefeed=true&widget=true&embed=true&preview=true"
            >
              With Ko-fi
            </Link>
            <p>supporting will ensure that</p>
            <ul>
              <li>GeoCrypt stays online</li>
              <li>GeoCrypt gets a new WASM port that allows larger files</li>
            </ul>
          </div>
          <br />
          copyright 2023
          <Image src="/edisys.png" alt="edisys logo" width="200" height="100" />
        </div>
      </main>
    </>
  );
}
