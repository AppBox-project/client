import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import styles from "./styles.module.scss";
import { IconButton } from "@material-ui/core";
import { FaTrashAlt } from "react-icons/fa";

const InputPicture: React.FC<{
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}> = ({ placeholder, label, value, onChange }) => {
  // Vars
  const [newValue, setNewValue] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState();

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  return file ? (
    <>
      <IconButton
        color="primary"
        onClick={() => {
          setFile(undefined);
        }}
      >
        <FaTrashAlt style={{ width: 15, height: 15 }} />
      </IconButton>
      {file.name}
    </>
  ) : (
    <Dropzone
      onDrop={(files) => {
        setIsDragging(false);
        setFile(files[0]);
      }}
      accept="image/*"
      multiple={false}
      onDragEnter={() => {
        setIsDragging(true);
      }}
      onDragLeave={() => {
        setIsDragging(false);
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <section
          className={`${styles.dropzone} ${isDragging && styles.isDragging}`}
        >
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Picture goes here</p>
          </div>
        </section>
      )}
    </Dropzone>
  );
};

export default InputPicture;
