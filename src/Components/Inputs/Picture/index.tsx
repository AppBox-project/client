import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import styles from "./styles.module.scss";
import { IconButton, Avatar } from "@material-ui/core";
import { FaTrashAlt } from "react-icons/fa";
import Axios from "axios";
import { ModelType } from "../../../Utils/Types";
import { baseUrl } from "../../../Utils/Utils";

const InputPicture: React.FC<{
  placeholder?: string;
  label?: string;
  value?: string;
  object;
  model: ModelType;
  onChange?: (value: string) => void;
  fieldKey: string;
}> = ({ placeholder, label, value, onChange, object, model, fieldKey }) => {
  // Vars
  const [newValue, setNewValue] = useState<any>("");
  const [isDragging, setIsDragging] = useState<any>(false);

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  return newValue ? (
    <Avatar style={{ backgroundImage: `url(${baseUrl + newValue})` }}>
      <IconButton
        color="primary"
        onClick={() => {
          setNewValue(undefined);
          onChange("");
        }}
      >
        <FaTrashAlt style={{ width: 15, height: 15 }} />
      </IconButton>
    </Avatar>
  ) : (
    <Dropzone
      onDrop={(files) => {
        setIsDragging(false);
        //setToUpload([...toUpload, files[0]]);
        var formData = new FormData();
        formData.append("username", localStorage.getItem("username"));
        formData.append("token", localStorage.getItem("token"));
        formData.append("modelType", model.key);
        formData.append("objectId", object._id);
        formData.append("fieldkey", fieldKey);
        formData.append("file", files[0]);
        Axios.post(`${baseUrl}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((response) => {
          setNewValue(response.data);
          onChange(response.data);
        });
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
