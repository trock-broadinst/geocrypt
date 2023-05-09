import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import React from "react";
import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";
import PasswordValidator from "password-validator";
import Link from "next/link";
import { vfPart1, vfPart2 } from "@/utils/vaultAssembly_new";
import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";

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

  const [files, setFiles] = React.useState<ExtFile[]>([]);

  const removeFile = (id: string | number | undefined) => {
    setFiles(files.filter((x) => x.id !== id));
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

    passwordZone.current.innerHTML = "";
    const zipProgress = document.createElement("progress");
    zipProgress.value = 0;
    zipProgress.max = 0;
    passwordZone.current.appendChild(zipProgress);

    const controller = new AbortController();
    const signal = controller.signal;
    const abortButton = document.createElement("button"); //TODO: throws error when used
    abortButton.onclick = () => controller.abort();
    abortButton.textContent = "✖";
    abortButton.title = "Abort";
    passwordZone.current.appendChild(abortButton);

    const options = {
      password: password, //TODO: dosen't actually encrypt
      signal,
      onstart(max: number) {
        const compressingText = document.createElement("p");
        compressingText.textContent = "Compressing...";
        passwordZone.current?.appendChild(compressingText);
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
          file.file &&
          zipWriter.add(file.file.name, new BlobReader(file.file), options)
      )
    );
    //download stream
    const fileHandle = await showSaveFilePicker({
      suggestedName: `geocrypt-${Date.now().toString()}.html`,
      types: [{ accept: { "text/html": [".html"] } }],
      excludeAcceptAllOption: false, // default
    });

    // create a FileSystemWritableFileStream to write to
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(vfPart1);
    await zipWriter
      .close()
      .then((buf) => buf.arrayBuffer())
      .then((arb) => new Uint8Array(arb))
      .then(async (uint8Arr: Uint8Array) => {
        const base64Alphabet =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        let i = 0;

        await writableStream.write("data:application/zip;base64,");
        while (i < uint8Arr.length) {
          const byte1 = uint8Arr[i++];
          const byte2 = i < uint8Arr.length ? uint8Arr[i++] : 0;
          const byte3 = i < uint8Arr.length ? uint8Arr[i++] : 0;

          const enc1 = base64Alphabet[byte1 >> 2];
          const enc2 = base64Alphabet[((byte1 & 0x03) << 4) | (byte2 >> 4)];
          const enc3 =
            i < uint8Arr.length
              ? base64Alphabet[((byte2 & 0x0f) << 2) | (byte3 >> 6)]
              : "=";
          const enc4 = i < uint8Arr.length ? base64Alphabet[byte3 & 0x3f] : "=";

          await writableStream.write(enc1 + enc2 + enc3 + enc4);
        }
      });
    //iterate through arraybuffer and write to stream

    await writableStream.write(vfPart2);
    await writableStream.close();
  };

  return (
    <>
      <Head>
        <title>GeoCrypt</title>
        <meta name="description" content="Encrypt files online free" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <div>
            <Image
              src="/geoCrypt.svg"
              alt="GeoCrypt Logo"
              width={300}
              height={300}
              priority
            />
            <p>$[GEOCRYPT] ▶ Encrypt &amp; Decrypt the easy way</p>
            <p>
              If you&apos;re looking for the old version
              <Link className={styles.link} href="/old">
                it&apos;s here
              </Link>
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <Dropzone
            style={{ background: "white" }} //TODO: dark/light mode
            maxFileSize={1073741824}
            onChange={(files) => {
              if (new Set(files.map((x) => x.name)).size !== files.length) {
                setFiles(
                  files.filter(
                    (x, i, a) => a.findIndex((y) => y.name === x.name) === i
                  )
                );
                return alert(
                  "Files cannot have duplicate names, duplicates will be removed in download"
                );
              } else setFiles(files);
            }}
            value={files}
          >
            {files.map((file) => (
              <FileMosaic key={file.id} {...file} onDelete={removeFile} info />
            ))}
          </Dropzone>
          <label htmlFor="password1">Password </label>
          <input
            ref={passwordInput}
            type="text"
            id="password1"
            placeholder="Enter password"
          />
          <br />
          <label htmlFor="password2">Confirm Password </label>
          <input
            ref={confirmPasswordInput}
            type="text"
            id="password2"
            placeholder="Confirm password"
          />
          <br />
          <div ref={passwordZone}></div>
          <br />
          <button onClick={() => encryptAndDownload()}>
            Encrypt files and download
          </button>
        </div>

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
            <iframe
              id="kofiframe"
              src="https://ko-fi.com/edisys/?hidefeed=true&widget=true&embed=true&preview=true"
              style={{
                border: "none",
                width: "100%",
                padding: "4px",
                background: "#f9f9f9",
              }}
              height="712"
              title="edisys"
            ></iframe>
          </div>
          <Image src="/edisys.png" alt="edisys logo" width="200" height="100" />
        </div>
      </main>
    </>
  );
}
