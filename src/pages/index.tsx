import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import React from "react";
import "core-js";
// import "core-js/features/set-immediate";
import FlavorText from "@/utils/flavortext";
// import CentralModal from "@/utils/central_modal";
import dynamic from "next/dynamic";
const CentralModal = dynamic(
  () => {
    return import("../utils/central_modal");
  },
  { ssr: false }
);

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
        <FlavorText />
      </main>
    </>
  );
}
