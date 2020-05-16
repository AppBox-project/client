import React from "react";
import ObjectFieldDisplayBoolean from "./FieldDisplay/Boolean";
import ObjectFieldDisplayInput from "./FieldDisplay/Input";
import ObjectFieldDisplayRelationship from "./FieldDisplay/Relationship";
import ObjectFieldDisplayPicture from "./FieldDisplay/Picture";
import ObjectFieldDisplayHtml from "./FieldDisplay/HTML";
import ObjectFieldDisplayColor from "./FieldDisplay/Color";

const FieldDisplay: React.FC<{ objectField; modelField }> = ({
  objectField,
  modelField,
}) => {
  return (
    <>
      {modelField.type === "boolean" && (
        <ObjectFieldDisplayBoolean
          modelField={modelField}
          objectField={objectField}
        />
      )}
      {(modelField.type === "input" ||
        modelField.type === "formula" ||
        modelField.type === "options") && (
        <ObjectFieldDisplayInput
          modelField={modelField}
          objectField={objectField}
        />
      )}
      {modelField.type === "relationship" && (
        <ObjectFieldDisplayRelationship
          modelField={modelField}
          objectField={objectField}
        />
      )}
      {modelField.type === "picture" && (
        <ObjectFieldDisplayPicture
          modelField={modelField}
          objectField={objectField}
        />
      )}
      {modelField.type === "richtext" && (
        <ObjectFieldDisplayHtml
          modelField={modelField}
          objectField={objectField}
        />
      )}
      {modelField.type === "color" && (
        <ObjectFieldDisplayColor
          modelField={modelField}
          objectField={objectField}
        />
      )}
    </>
  );
};

export default FieldDisplay;
