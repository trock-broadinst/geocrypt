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

const inter = Inter({ subsets: ["latin"] });

const passwordSchema = new PasswordValidator();
passwordSchema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces();

const maxSize = 2.5e8; //250MB

const fancyBytes = (bytes: number) => {
  const size = Math.floor(bytes / 1e6);
  return size < 1 ? `${Math.floor(bytes / 1e3)}Kb` : `${size}Mb`;
};

export default function Home() {
  const passwordInput = React.useRef<HTMLInputElement>(null);
  const confirmPasswordInput = React.useRef<HTMLInputElement>(null);
  const passwordZone = React.useRef<HTMLInputElement>(null);

  const [files, setFiles] = React.useState<File[]>([]);
  const [totalSize, setTotalSize] = React.useState<number>(0);

  const addFiles = (initialList: File[]) => {
    const files = Array.from(initialList);
    //check total filesize
    const totalSize = files.reduce((a, b) => a + b.size, 0);

    if (totalSize > maxSize)
      return alert("Total file size cannot exceed 250MB");
    setTotalSize(totalSize);

    if (new Set(files.map((x) => x.name)).size !== files.length) {
      setFiles(
        files.filter((x, i, a) => a.findIndex((y) => y.name === x.name) === i)
      );
      return alert(
        "Files cannot have duplicate names, duplicates will be removed in download"
      );
    } else setFiles(files);
  };

  const removeFile = (name: string | number | undefined) => {
    setFiles(files.filter((x) => x.name !== name));
  };

  const getPassword = () => {
    const password = passwordInput.current?.value;
    const confirmPassword = confirmPasswordInput.current?.value;
    const passwordErrorZone = passwordZone.current;
    let pweOccured = false;
    const addPwError = (msg: string[]) => {
      if (passwordErrorZone) {
        pweOccured = true;
        passwordErrorZone.innerHTML = "";
        msg.forEach((m) => {
          const p = document.createElement("p");
          p.setAttribute("style", "color: red");
          p.innerHTML = m;
          passwordErrorZone.appendChild(p);
        });
      }
    };
    if (!password || !confirmPassword)
      return addPwError(["please confirm password"]);
    if (password !== confirmPassword)
      return addPwError(["passwords do not match"]);
    const validatedList = passwordSchema.validate(password, { details: true });
    if (typeof validatedList !== "boolean" && validatedList.length > 0)
      addPwError(validatedList.map((x) => x.message));
    if (pweOccured) return undefined;
    else return password;
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
  }, []);

  const encryptAndDownload = async () => {
    const password = getPassword();
    if (!password || !passwordZone.current) return;

    //download stream
    const fileHandle = await showSaveFilePicker({
      suggestedName: `geocrypt-${Date.now().toString()}.html`,
      accepts: [{ accept: { "text/html": [".html"] } }],
      excludeAcceptAllOption: false, // default
    });

    // must be at top of function for security purposes
    // create a FileSystemWritableFileStream to write to
    const writableStream = await fileHandle.createWritable();

    passwordZone.current.innerHTML = "";
    const zipProgress = document.createElement("progress");
    zipProgress.value = 0;
    zipProgress.max = 0;
    passwordZone.current.appendChild(zipProgress);

    const controller = new AbortController();
    const signal = controller.signal;
    const abortButton = document.createElement("button");
    abortButton.onclick = () => {
      controller.abort("Aborted by user");
      zipProgress.remove();
      abortButton.remove();
      compressingText.remove();
    };
    abortButton.textContent = "✖";
    abortButton.title = "Abort";
    passwordZone.current.appendChild(abortButton);

    const compressingText = document.createElement("p");
    compressingText.textContent = "Compressing...";
    passwordZone.current?.appendChild(compressingText);

    const options: ZipWriterAddDataOptions = {
      password: password,
      signal,
      onstart(max: number) {
        zipProgress.max = max;
        return undefined;
      },
      onprogress(index: number, max: number) {
        zipProgress.value = index;
        zipProgress.max = max;
        return undefined;
      },
    };

    const zipWriter = new ZipWriter(new BlobWriter("application/zip"), {
      bufferedWrite: true,
    });

    await Promise.all(
      files.map(
        (file) =>
          file && zipWriter.add(file.name, new BlobReader(file), options)
      )
    );

    await writableStream.write(vfPart1);
    await zipWriter
      .close()
      .then((blob) => blob.arrayBuffer())
      .then((arb) => b64.encode(Buffer.from(arb)))
      .then((wst) => writableStream.write(wst))
      .then(() => writableStream.write(vfPart2))
      .then(() => writableStream.close())
      .finally(() => {
        zipProgress.remove();
        abortButton.remove();
        compressingText.remove();
      })
      .catch((err) => alert(err));
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
          <FileUploader
            multiple={true}
            required={true}
            handleChange={addFiles}
            name="file"
          >
            <div className={styles.uploadbox}>
              Drag &amp; Drop files here <p>{fancyBytes(totalSize)}/250MB</p>
            </div>
          </FileUploader>
          <br />
          <div
            className={styles.card}
            style={{ height: "15em", width: "20em", overflow: "overlay" }}
          >
            {files.length > 0 &&
              files.map((file) => (
                <div className={styles.filelistbox} key={file.name}>
                  {file.name}{" "}
                  <p>
                    {fancyBytes(file.size)}{" "}
                    <button onClick={() => removeFile(file.name)}>✖</button>
                  </p>
                  <hr />
                </div>
              ))}
          </div>
          <input
            ref={passwordInput}
            type="text"
            id="password1"
            className={styles.textbox}
            placeholder="Enter password"
          />
          <br />
          <input
            ref={confirmPasswordInput}
            type="text"
            id="password2"
            className={styles.textbox}
            placeholder="Confirm password"
          />
          <br />
          <div ref={passwordZone}></div>
          <br />
          <button
            className={styles.bigbutton}
            onClick={() => encryptAndDownload()}
          >
            Encrypt files and download
          </button>
        </div>

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
          <p>
            If you&apos;re looking for the old version{" "}
            <Link className={styles.link} href="/old">
              it&apos;s here
            </Link>
            <br />
            copyright 2023
          </p>
          <br />
          <Image src="/edisys.png" alt="edisys logo" width="200" height="100" />
        </div>
      </main>
    </>
  );
}
