import React from "react";
import ObjectFieldDisplayBoolean from "./FieldDisplay/Boolean";
import ObjectFieldDisplayInput from "./FieldDisplay/Input";
import ObjectFieldDisplayRelationship from "./FieldDisplay/Relationship";
import ObjectFieldDisplayPicture from "./FieldDisplay/Picture";
import ObjectFieldDisplayHtml from "./FieldDisplay/HTML";
import ObjectFieldDisplayColor from "./FieldDisplay/Color";
import ObjectFieldDisplayRelationshipM from "./FieldDisplay/Relationship_m";

const FieldDisplay: React.FC<{ objectField; modelField; props? }> = ({
  objectField,
  modelField,
  props,
}) => {
  return (
    <>
      {modelField.type === "boolean" && (
        <ObjectFieldDisplayBoolean
          modelField={modelField}
          objectField={objectField}
          {...props}
        />
      )}
      {(modelField.type === "input" ||
        modelField.type === "formula" ||
        modelField.type === "options") && (
        <ObjectFieldDisplayInput
          modelField={modelField}
          objectField={objectField}
          {...props}
        />
      )}
      {modelField.type === "relationship" && (
        <ObjectFieldDisplayRelationship
          modelField={modelField}
          objectField={objectField}
          {...props}
        />
      )}
      {modelField.type === "relationship_m" && (
        <ObjectFieldDisplayRelationshipM
          modelField={modelField}
          objectField={objectField}
          {...props}
        />
      )}
      {modelField.type === "picture" && (
        <ObjectFieldDisplayPicture
          modelField={modelField}
          objectField={objectField}
          {...props}
        />
      )}
      {modelField.type === "richtext" && (
        <ObjectFieldDisplayHtml
          modelField={modelField}
          objectField={objectField}
          {...props}
        />
      )}
      {modelField.type === "color" && (
        <ObjectFieldDisplayColor
          modelField={modelField}
          objectField={objectField}
          {...props}
        />
      )}
    </>
  );
};

export default FieldDisplay;
