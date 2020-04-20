import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

const InputDrafting: React.FC<{
  placeholder?: string;
  mode?: "normal" | "inline";
  onChange: (value: string) => void;
  value?: string;
}> = ({ placeholder, mode, onChange, value }) => {
  // Vars
  const [newValue, setNewValue] = useState(value);

  // Lifecycle

  // UI
  return (
    <>
      <ReactQuill
        theme={!mode || mode == "normal" ? "snow" : "bubble"}
        value={newValue}
        onChange={(val) => {
          setNewValue(val);
          onChange(val);
        }}
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
    </>
  );
};

export default InputDrafting;
