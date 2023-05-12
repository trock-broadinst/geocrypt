import { FileUploader } from "react-drag-drop-files";
import styles from "@/styles/Home.module.css";
import React, { Dispatch, SetStateAction } from "react";

const maxSize = 2.5e8; //250MB

const fancyBytes = (bytes: number) => {
  const size = Math.floor(bytes / 1e6);
  return size < 1 ? `${Math.floor(bytes / 1e3)}Kb` : `${size}Mb`;
};

const HandleUpload = (props: {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}) => {
  const { files, setFiles } = props;
  const [totalSize, setTotalSize] = React.useState<number>(0);

  const addFiles = (initialList: File[]) => {
    const files = Array.from(initialList);
    //check total filesize
    const totalSize = files.reduce((a, b) => a + b.size, 0);

    if (totalSize > maxSize)
      return alert("Total file size cannot exceed 250MB");
    setTotalSize(totalSize);

    if (new Set(files.map((x) => x.name)).size !== files.length) {
      setFiles(
        files.filter((x, i, a) => a.findIndex((y) => y.name === x.name) === i)
      );
      return alert(
        "Files cannot have duplicate names, duplicates will be removed in download"
      );
    } else setFiles(files);
  };

  const removeFile = (name: string | number | undefined) => {
    setFiles(files.filter((x) => x.name !== name));
  };
  return (
    <>
      <FileUploader
        multiple={true}
        required={true}
        handleChange={addFiles}
        name="file"
      >
        <div className={styles.uploadbox}>
          Drag &amp; Drop files here <p>{fancyBytes(totalSize)}/250MB</p>
        </div>
      </FileUploader>
      <br />
      <div
        className={styles.card}
        style={{ height: "15em", width: "20em", overflow: "overlay" }}
      >
        {files.length > 0 &&
          files.map((file) => (
            <div className={styles.filelistbox} key={file.name}>
              {file.name}{" "}
              <p>
                {fancyBytes(file.size)}{" "}
                <button onClick={() => removeFile(file.name)}>✖</button>
              </p>
              <hr />
            </div>
          ))}
      </div>
    </>
  );
};

export default HandleUpload;
