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
  const [initial, setInitial] = useState(true);

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
    setInitial(true);
  }, [value]);

  // UI
  return (
    <CKEditor
      editor={ClassicEditor}
      data={newValue}
      onChange={(event, editor) => {
        console.log(event);

        if (initial) {
          // Prevent initial save
          setInitial(false);
        } else {
          const data = editor.getData();
          setNewValue(data);
          if (onChange) onChange(data);
        }
      }}
    />
  );
};

export default InputDrafting;
