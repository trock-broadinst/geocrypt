import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import React from "react";
import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";
import JSZip from "jszip";
import CryptoJS from "crypto-js";
import { generateVaultFile } from "@/utils/vaultAssembly_old";
import PasswordValidator from "password-validator";
import Link from "next/link";

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

  function encrypt(buffer: Buffer, key: string): string {
    var ciphertext = CryptoJS.AES.encrypt(buffer.toString("base64"), key, {
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    });
    return ciphertext.toString();
  }

  function download(text: string) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", `geocrypt-${Date.now().toString()}.html`);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  const getPassword = () => {
    const password = passwordInput.current?.value;
    const confirmPassword = confirmPasswordInput.current?.value;
    const passwordErrorZone = passwordZone.current;
    const addPwError = (msg: string[]) => {
      if (passwordErrorZone) {
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
      return addPwError(["please confirm password"]); //TODO: show error
    if (password !== confirmPassword)
      return addPwError(["passwords do not match"]); //TODO: show error
    const validatedList = passwordSchema.validate(password, { details: true });
    if (typeof validatedList !== "boolean")
      addPwError(validatedList.map((x) => x.message));

    return password;
  };

  const encryptAndDownload = async () => {
    const password = getPassword();

    //TODO: add text insert dialog later  zip.file("Hello.txt", "Hello World\n");

    if (!password) return;
    const zip = new JSZip();
    await Promise.all(
      files.map(async (file) => {
        await file.file?.arrayBuffer().then(async (buffer) => {
          await zip.file(file.name!, buffer);
        });
      })
    )
      .then(() => zip.generateAsync({ type: "arraybuffer" }))
      .then((content) => {
        //arraybuffer to buffer
        const buffer = Buffer.from(content);
        const contentCrypt = encrypt(buffer, password);

        return download(generateVaultFile(contentCrypt));
      });
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
              This is the old version of GeoCrypt, try the new version{" "}
              <Link className={styles.link} href="/">
                here
              </Link>
            </p>
            <p>
              This version is ideal for older browsers, however has a file size
              limit of 49 mb
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <Dropzone
            style={{ background: "white" }} //TODO: dark/light mode
            maxFileSize={1e9}
            onChange={setFiles}
            value={files}
            validator={(file) => {
              //limit file size to 49 mb
              if (file.size > 49e6)
                return { valid: false, errors: ["File too large"] };
              return { valid: true };
            }}
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
        </div>
      </main>
    </>
  ); //TODO: edisys logo
}
