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

  const calculateSize = (newFiles: File[]) => {
    //check total filesize
    const totalSize = newFiles.reduce((a, b) => a + b.size, 0);

    if (totalSize > maxSize)
      return alert("Total file size cannot exceed 250MB");
    setTotalSize(totalSize);
  };

  const addFiles = (initialList: File[]) => {
    let newFiles = [...Array.from(initialList), ...files];

    if (new Set(newFiles.map((x) => x.name)).size !== newFiles.length) {
      newFiles = newFiles.filter(
        (x, i, a) => a.findIndex((y) => y.name === x.name) === i
      );
      alert(
        "Files cannot have duplicate names, duplicates will be removed in download"
      );
    }
    calculateSize(newFiles);

    return setFiles(newFiles);
  };

  const removeFile = (name: string | number | undefined) => {
    const newFiles = files.filter((x) => x.name !== name);
    calculateSize(newFiles);
    setFiles(newFiles);
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
      <div className={styles.filelistcontainer}>
        {files.length > 0 &&
          files.map((file) => (
            <div className={styles.filelistbox} key={file.name}>
              {file.name} <p>{fancyBytes(file.size)} </p>
              <button
                className={styles.bigbutton}
                style={{ padding: "0.3em" }}
                onClick={() => removeFile(file.name)}
              >
                ✖
              </button>
              <hr />
            </div>
          ))}
      </div>
    </>
  );
};

export default HandleUpload;
