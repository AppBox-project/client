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
  useEffect(() => {
    setNewValue(value);
  }, [value]);

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
            [{ align: [] }],
            ['link', 'image'],
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "bullet" }, { list: "ordered" }],
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }], // dropdown with defaults from theme
            ["blockquote", "code-block"],
            ["clean"], // remove formatting button
          ],
        }}
      />
    </>
  );
};

export default InputDrafting;
