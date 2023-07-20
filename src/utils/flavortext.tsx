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
          Your files will be compressed and encrypted with WINZIP-AES, an
          industry-standard security algorithm. GeoCrypt is fully open source,
          with a pipeline that is as transparent as possible, ensuring your
          browser runs exactly what&#39;s in{" "}
          <a
            href="https://github.com/trock-broadinst/geocrypt"
            className={styles.link}
          >
            the repo
          </a>
          . Additionally, this software runs entirely offline(we even removed
          CDN dependencies, so no external resources are loaded), we advise you
          save it as a PWA and use it with airplane mode enabled.
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
          Convenient <span>⤵</span>
        </h2>
        <p>
          We recommend installing GeoCrypt as a PWA for the added security of it
          working fully offline, and convenience of being able to access it
          outside a browser. You can typically do this by clicking the install
          button in or near the URL bar.
        </p>
      </div>
      <div className={styles.card}>
        <h2>
          How can I support this? <span>⤵</span>
        </h2>
        <Link
          className={styles.link}
          href="https://ko-fi.com/edisys/?hidefeed=true&widget=true&embed=true&preview=true"
          passHref
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
      <Image src="/edisys.svg" alt="edisys logo" width="200" height="100" />
      <img
        src="https://counter3.optistats.ovh/private/freecounterstat.php?c=z1algp2y5rn67delseb9qqa71wdk9rxf"
        title="web counter"
        alt="web counter"
      />
    </div>
  );
}

export default FlavorText;
