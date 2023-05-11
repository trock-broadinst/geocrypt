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
import { HandleUpload } from "@/pages/uploader";

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

export default function Home() {
  const passwordInput = React.useRef<HTMLInputElement>(null);
  const confirmPasswordInput = React.useRef<HTMLInputElement>(null);
  const passwordZone = React.useRef<HTMLInputElement>(null);

  const [files, setFiles] = React.useState<File[]>([]);

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
          <HandleUpload setFiles={setFiles} files={files} />
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
          <br />
          copyright 2023
          <Image src="/edisys.png" alt="edisys logo" width="200" height="100" />
        </div>
      </main>
    </>
  );
}
