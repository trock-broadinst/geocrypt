import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>GeoCrypt: 404</title>
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Image
          src="/geoCrypt.svg"
          alt="GeoCrypt Logo"
          width={300}
          height={300}
          priority
        />
        <h1> 404 </h1>
        <h4> Error: page not found </h4>
        <Link href="/" className={styles.link}>
          Go home
        </Link>
      </main>
    </>
  );
}
