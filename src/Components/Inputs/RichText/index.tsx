import React, { useState, useEffect } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import mode from "@ckeditor/ckeditor5-build-classic";

const InputRichText: React.FC<{
  placeholder?: string;
  label?: string;
  value?: string;
  mode?: "classic" | "balloon";
  onChange?: (value: string) => void;
}> = ({ placeholder, label, value, onChange }) => {
  // Vars
  const [newValue, setNewValue] = useState("");

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  return (
    <CKEditor
      editor={mode}
      data={newValue}
      onChange={(event, editor) => {
        const data = editor.getData();
        setNewValue(data);
        if (onChange) onChange(data);
      }}
    />
  );
};

export default InputRichText;
