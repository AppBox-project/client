import React from "react";
import ObjectFieldDisplayBoolean from "./FieldDisplay/Boolean";
import ObjectFieldDisplayInput from "./FieldDisplay/Input";
import ObjectFieldDisplayRelationship from "./FieldDisplay/Relationship";
import ObjectFieldDisplayPicture from "./FieldDisplay/Picture";
import ObjectFieldDisplayHtml from "./FieldDisplay/HTML";
import ObjectFieldDisplayColor from "./FieldDisplay/Color";
import ObjectFieldDisplayRelationshipM from "./FieldDisplay/Relationship_m";
import ObjectFieldDisplayFile from "./FieldDisplay/File";
import ObjectFieldDisplayDate from "./FieldDisplay/Date";
import { CustomFieldType, AppContextType } from "../../Utils/Types";
import QRCode from "qrcode.react";

const FieldDisplay: React.FC<{
  objectField;
  modelField;
  remoteModelCache?;
  onLoadRemoteModel?;
  remoteObjectCache?;
  onLoadRemoteObject?;
  props?;
  small?: true;
  CustomField?: React.FC<CustomFieldType>;
  context?: AppContextType;
}> = ({
  objectField,
  modelField,
  remoteModelCache,
  onLoadRemoteModel,
  remoteObjectCache,
  onLoadRemoteObject,
  props,
  small,
  CustomField,
  context,
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
        modelField.type === "options" ||
        modelField.type === "address" ||
        modelField.type === "data") && (
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
          remoteModelCache={remoteModelCache}
          onLoadRemoteModel={onLoadRemoteModel}
          remoteObjectCache={remoteObjectCache}
          onLoadRemoteObject={onLoadRemoteObject}
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
          small={small}
          {...props}
        />
      )}
      {modelField.type === "file" && (
        <ObjectFieldDisplayFile
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
      {modelField.type === "date" && (
        <ObjectFieldDisplayDate
          modelField={modelField}
          objectField={objectField}
          {...props}
        />
      )}
      {modelField.type === "qr" && objectField && (
        <QRCode value={objectField} size={small && 50} />
      )}
      {modelField.type === "custom" && (
        <CustomField mode="view" value={objectField} context={context} />
      )}
      {modelField.type === "formula" &&
        (!(modelField.typeArgs || {}).type ||
          (modelField.typeArgs || {}).type === "text" ||
          (modelField.typeArgs || {}).type === "number") && (
          <ObjectFieldDisplayInput
            modelField={modelField}
            objectField={objectField}
            {...props}
          />
        )}
      {modelField.type === "formula" &&
        (modelField.typeArgs || {}).type === "boolean" && (
          <ObjectFieldDisplayBoolean
            modelField={modelField}
            objectField={objectField}
            {...props}
          />
        )}
      {modelField.type === "formula" &&
        (modelField.typeArgs || {}).type === "picture" && (
          <ObjectFieldDisplayPicture
            modelField={modelField}
            objectField={objectField}
            small={small}
            {...props}
          />
        )}
    </>
  );
};

export default FieldDisplay;
