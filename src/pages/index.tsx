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
import CentralModal from "@/utils/central_modal";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
        <h2>[ GeoCrypt ]</h2>
        <h4> Encrypt &amp; Decrypt the easy way</h4>
        <br />
        <CentralModal />
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
