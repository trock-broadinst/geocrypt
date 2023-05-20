import styles from "@/styles/Home.module.css";
import localFont from "next/font/local";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const inter = localFont({ src: "../styles/Inter-Regular.ttf" });

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
        />
        <h1> 404 </h1>
        <h4> Error: page not found </h4>
        <Link href="/" className={styles.link} passHref>
          Go home
        </Link>
      </main>
    </>
  );
}
