import styles from "@/styles/Home.module.css";
import dynamic from "next/dynamic";
import localFont from "next/font/local";

const DynaChat = dynamic(() => import("../utils/sidecar/RTCClient"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
const inter = localFont({ src: "../styles/Inter-Regular.ttf" });

export default function Home() {
  return (
    <main className={`${styles.main} ${inter.className}`}>
      <DynaChat />
    </main>
  );
}
