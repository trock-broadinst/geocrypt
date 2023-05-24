import styles from "@/styles/Home.module.css";
import FlavorText from "@/utils/flavortext";
import "core-js";
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import Head from "next/head";
import Image from "next/image";

const CentralModal = dynamic(() => import("../utils/vault/central_modal"), {
  ssr: false,
});

const inter = localFont({ src: "../styles/Inter-Regular.ttf" });

export default function Home() {
  return (
    <>
      <Head>
        <title>GeoCrypt</title>
        <meta name="title" content="Open source free online encryption tool" />
        <meta
          name="description"
          content="Geocrypt is an open source, free encryption tool that works entirely in your browser, and outputs a shareable HTML file that can be opened in most browsers"
        />
        <meta
          name="keywords"
          content="encryption, encrypt, free, decrypt, simple, files online, open source"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/geoCrypt.svg" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Image
          src="/geoCrypt.svg"
          alt="GeoCrypt Logo"
          width={300}
          height={300}
        />
        <h1> GeoCrypt </h1>
        <h4> Encrypt &amp; Decrypt the easy way</h4>
        <br />
        <CentralModal />
        <br />
        <p className={styles.description} style={{ width: "30em" }}>
          Geocrypt is an open source, free encryption tool that works entirely
          in your browser, and outputs a shareable HTML file that can be opened
          in most browsers.
        </p>
        <br />
        <FlavorText />
      </main>
    </>
  );
}
