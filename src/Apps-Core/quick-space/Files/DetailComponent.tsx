import React, { useEffect } from "reactn";
import { AppContextType, ModelType } from "../../../Utils/Types";
import { useState } from "react";
import { Skeleton } from "@material-ui/lab";

const AppQSActionFileDetail: React.FC<{
  context: AppContextType;
  match: { params: { detailId } };
  model: ModelType;
}> = ({
  context,
  match: {
    params: { detailId },
  },
  model,
}) => {
  // Vars
  const [file, setFile] = useState<any>();

  // Lifecycle
  useEffect(() => {
    const request = context.getObjects(
      "qs-files",
      { _id: detailId },
      (response) => {
        if (response.success) {
          setFile(response.data[0]);
        } else {
          console.log(response);
        }
      }
    );

    return () => {
      request.stop();
    };
  }, [detailId]);

  // UI
  if (!file) return <Skeleton />;
  return (
    <context.UI.Object.Detail
      model={model}
      modelId="qs-file"
      layoutId="default"
      baseUrl={`/quick-space/files/${detailId}`}
      context={context}
      defaults={{ owner: context.user._id }}
      objectId={file._id}
      object={file}
    />
  );
};

export default AppQSActionFileDetail;
