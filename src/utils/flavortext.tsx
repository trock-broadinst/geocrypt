import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";

function FlavorText() {
  return (
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
          browser, even offline(once necessary libraries have loaded). Be sure
          to share the password through a secure channel.
        </p>
      </div>
      <div className={styles.card}>
        <h2>
          Is this legal? <span>⤵</span>
        </h2>
        <p>
          Some nations have laws against encryption, such as Australia. We
          don&apos;t care about your location, so use at your own risk. We are
          not responsible for data loss, illegal use, or any other damages.
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
  );
}

export default FlavorText;
