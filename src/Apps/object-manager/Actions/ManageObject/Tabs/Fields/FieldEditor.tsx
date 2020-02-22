import React from "react";

const AppActionManageObjectTabFieldsEditor: React.FC<{
  match: { params: { object; field } };
}> = ({
  match: {
    params: { field }
  }
}) => {
  return <>{field}</>;
};

export default AppActionManageObjectTabFieldsEditor;
