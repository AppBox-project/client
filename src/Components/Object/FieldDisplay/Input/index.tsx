import React from "react";

const ObjectFieldDisplayInput: React.FC<{ modelField; objectField }> = ({
  objectField,
  modelField,
}) => {
  if (modelField.typeArgs) {
    if (modelField.typeArgs.type === "password") {
      return <>······</>;
    }
  }
  return <>{objectField}</>;
};

export default ObjectFieldDisplayInput;
