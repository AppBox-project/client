import React from "react";
import { FaEyeDropper } from "react-icons/fa";
import { Avatar, Chip } from "@material-ui/core";

const ObjectFieldDisplayColor: React.FC<{ modelField; objectField }> = ({
  objectField,
  modelField,
}) => {
  return (
    <Chip
      style={{
        transition: "all 1s",
        backgroundColor: objectField
          ? `rgba(${objectField.r},${objectField.g},${objectField.b},${objectField.a})`
          : "rgba(50,50,50,1)",
      }}
      label={<FaEyeDropper style={{ color: "white", width: 15, height: 15 }} />}
    />
  );
};

export default ObjectFieldDisplayColor;
