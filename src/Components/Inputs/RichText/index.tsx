import React, { useState, useEffect } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const InputRichText: React.FC<{
  placeholder?: string;
  label?: string;
  value?: string;
  mode?: "classic" | "balloon";
  onChange?: (value: string) => void;
}> = ({ placeholder, label, value, onChange }) => {
  // Vars
  const [newValue, setNewValue] = useState<any>(value);

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{}}
      data={newValue}
      onChange={(event, editor) => {
        const data = editor.getData();
        if (data !== value) {
          setNewValue(data);
          if (onChange) onChange(data);
        }
      }}
    />
  );
};

export default InputRichText;
