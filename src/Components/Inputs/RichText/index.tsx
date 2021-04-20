import React, { useState, useEffect, Suspense } from "react";
import "react-quill/dist/quill.snow.css";
import Loading from "../../Loading";
const ReactQuill = React.lazy(() => import("react-quill"));

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
    <Suspense fallback={<Loading />}>
      <ReactQuill
        theme="snow"
        value={newValue}
        onChange={(val) => {
          setNewValue(val);
          if (onChange) onChange(val);
        }}
      />
    </Suspense>
  );
};

export default InputRichText;
