import React from "react";
import { compareAsc, format } from "date-fns";

const ObjectFieldDisplayDate: React.FC<{ modelField; objectField }> = ({
  objectField,
  modelField,
}) => {
  return <>{objectField ? format(new Date(objectField), "dd-MM-yyyy") : ""}</>;
};

export default ObjectFieldDisplayDate;
