import React from "react";

const ObjectFieldDisplayHtml: React.FC<{ modelField; objectField }> = ({
  objectField,
  modelField,
}) => {
  return <div dangerouslySetInnerHTML={{ __html: objectField }} />;
};

export default ObjectFieldDisplayHtml;
