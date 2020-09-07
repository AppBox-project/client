import React, { useState, useEffect } from "react";
import {
  AppContextType,
  ModelType,
  ObjectType,
} from "../../../../../../Utils/Types";
import { find } from "lodash";
import { Skeleton } from "@material-ui/lab";

const AppActionManageObjectTabExtensionIDetail: React.FC<{
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
  // Vars
  const [extension, setExtension] = useState<ObjectType>();
  const [modelExtension, setModelExtension] = useState<any>();

  // Lifecycle
  useEffect(() => {
    setExtension(find(availableExtensions, (o) => o.data.key === detailId));
    setModelExtension(model.extensions[detailId]);
  }, [detailId, model, availableExtensions]);

  // UI
  console.log(extension, modelExtension);

  if (!extension && !modelExtension) return <Skeleton />;
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <context.UI.Design.Card withBigMargin title={modelExtension.name}>
          Test
        </context.UI.Design.Card>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppActionManageObjectTabExtensionIDetail;
