import React, { useState, useEffect } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
  }, []);

  // UI
  return (
    <CKEditor
      editor={ClassicEditor}
      data={newValue}
      onChange={(event, editor) => {
        const data = editor.getData();
        setNewValue(data);
        if (onChange) onChange(data);
      }}
    />
  );
};

export default InputDrafting;
