import React, { useState, useEffect, Suspense } from "react";
import Loading from "../../Loading";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

const ReactQuill = React.lazy(() => import("react-quill"));

const presetToolbars = {
  default: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["image", "link"],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ align: [] }],
    ["clean"], // remove formatting button
  ],
  full: [
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
  minimal: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"], // remove formatting button
  ],
};
const InputRichText: React.FC<{
  placeholder?: string;
  label?: string;
  value?: string;
  mode?: "classic" | "balloon";
  onChange?: (value: string) => void;
  variant?: "regular" | "inline";
  toolbar?: "regular" | "minimal" | "full";
}> = ({ placeholder, label, value, onChange, variant, toolbar }) => {
  // Vars
  const [newValue, setNewValue] = useState<any>(value);

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  return (
    <Suspense fallback={<Loading />}>
      <ReactQuill
        theme={variant === "inline" ? "bubble" : "snow"}
        value={newValue}
        modules={{
          toolbar: presetToolbars[toolbar] || presetToolbars["default"],
        }}
        onChange={(val) => {
          setNewValue(val);
          if (onChange) onChange(val);
        }}
      />
    </Suspense>
  );
};

export default InputRichText;
