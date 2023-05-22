import styles from "@/styles/Home.module.css";
import React, { useEffect } from "react";
import { Message } from "./helpers";

interface IMessagesProps {
  messages: Message[];
}

export default function Messages(props: IMessagesProps) {
  const lastMessage = React.useRef<HTMLDivElement>(null);
  const { messages } = props;
  useEffect(() => {
    if (lastMessage.current)
      lastMessage.current.scrollIntoView({ behavior: "smooth", block: "end" });
  });
  return (
    <div className={styles.filelistcontainer}>
      {messages.map((message, index) =>
        message.isSystem ? (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={styles.filelistbox}
            style={{ textAlign: "center" }}
          >
            {message.text}
          </div>
        ) : (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            ref={index + 1 === messages.length ? lastMessage : null}
            className={`tag is-medium ${styles.filelistbox}`}
            style={
              message.isSender
                ? {
                    backgroundColor: "#f5f5f5",
                    color: "black",
                    textAlign: "right",
                    marginLeft: "auto",
                    marginRight: 0,
                    width: "fit-content",
                  }
                : {
                    backgroundColor: "#00d1b2",
                    color: "white",
                    textAlign: "left",
                    width: "fit-content",
                  }
            }
          >
            {message.text}
          </div>
        )
      )}
    </div>
  );
}
