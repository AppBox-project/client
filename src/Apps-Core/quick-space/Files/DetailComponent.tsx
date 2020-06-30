import React, { useEffect } from "reactn";
import { AppContextType } from "../../../Utils/Types";
import { useState } from "react";
import { baseUrl } from "../../../Utils/Utils";

const AppQSActionFileDetail: React.FC<{
  context: AppContextType;
  match: { params: { detailId } };
}> = ({
  context,
  match: {
    params: { detailId },
  },
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
  if (!file) return <context.UI.Loading />;
  return <>{baseUrl + file.data.file}</>;
};

export default AppQSActionFileDetail;
