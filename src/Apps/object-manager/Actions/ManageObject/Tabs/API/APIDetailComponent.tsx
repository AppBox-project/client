import React from "react";
import { AppContextType, ModelType } from "../../../../../../Utils/Types";

const AppActionManageObjectTabAPIDetail: React.FC<{
  match: { params: { detailId } };
  context: AppContextType;
  model: ModelType;
}> = ({
  match: {
    params: { detailId },
  },
  context,
  model,
}) => {
  return <>API Detail {detailId}</>;
};

export default AppActionManageObjectTabAPIDetail;
