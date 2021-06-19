import React, { useState, useEffect, Suspense } from "react";
import {
  AppContextType,
  ModelType,
  ObjectType,
} from "../../../../../../Utils/Types";
import find from "lodash/find";
import { Skeleton } from "@material-ui/lab";
import { Button } from "@material-ui/core";

const AppActionManageObjectTabDuplicateRulesDetail: React.FC<{
  match: { params: { detailId } };
  context: AppContextType;
  model: ModelType;
  availableExtensions: ObjectType[];
}> = ({
  match: {
    params: { detailId },
  },
  context,
  model,
  availableExtensions,
}) => {
  return <>Test</>;
};

export default AppActionManageObjectTabDuplicateRulesDetail;
