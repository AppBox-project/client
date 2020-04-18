import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import styles from "./styles.module.scss";

const InputDrafting: React.FC<{
  placeholder?: string;
  mode?: "normal" | "inline";
}> = ({ placeholder, mode }) => {
  // Vars
  const [value, setValue] = useState("");
  console.log(mode, !mode || mode == "normal" ? "snow" : "bubble");

  // UI
  return (
    <div style={{ height: 300, marginTop: 300 }}>
      <ReactQuill
        theme={!mode || mode == "normal" ? "snow" : "bubble"}
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        modules={{
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction

            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],

            ["clean"], // remove formatting button
          ],
        }}
      />
    </div>
  );
};

export default InputDrafting;
