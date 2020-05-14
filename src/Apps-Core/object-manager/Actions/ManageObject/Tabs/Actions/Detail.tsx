import React, { useEffect, useState } from "react";
import {
  AppContextType,
  ModelFieldType,
  ModelType,
  UIType,
} from "../../../../../../Utils/Types";

const AppActionManageObjectActionsDetail: React.FC<{
  match: { params: { detailId } };
  context: AppContextType;
  fields: [ModelFieldType];
  model: ModelType;
}> = ({
  match: {
    params: { detailId },
  },
  context,
  fields,
  model,
}) => {
  return <>Test</>;
};

export default AppActionManageObjectActionsDetail;
