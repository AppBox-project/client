import React, { useState, useEffect, Suspense } from "react";
import {
  AppContextType,
  ModelType,
  ObjectType,
} from "../../../../../../Utils/Types";
import find from "lodash/find";
import { Skeleton } from "@material-ui/lab";
import { Button } from "@material-ui/core";

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
  const [ConfigureComponent, setConfigureComponent] = useState<
    React.FC<{
      onChange: (value) => void;
      context: AppContextType;
      modelExtension: {};
      model: ModelType;
    }>
  >();

  // Lifecycle
  useEffect(() => {
    setExtension(find(availableExtensions, (o) => o.data.key === detailId));
    setModelExtension(model.extensions[detailId]);
    // Todo: can this cause path traversal?
    setConfigureComponent(
      React.lazy(
        () =>
          import(
            `../../../../../../Components/Object/Extensions/${detailId}/configure`
          )
      )
    );
  }, [detailId, model, availableExtensions]);

  // UI

  if (!extension && !modelExtension) return <Skeleton />;
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <context.UI.Design.Card withBigMargin title={modelExtension.name}>
          <Suspense fallback={<context.UI.Loading />}>
            <ConfigureComponent
              onChange={(value) => setModelExtension(value)}
              context={context}
              modelExtension={modelExtension}
              model={model}
            />
          </Suspense>
          <Button
            fullWidth
            color="primary"
            onClick={() => {
              context.updateModel(
                model.key,
                {
                  extensions: {
                    ...model.extensions,
                    [detailId]: modelExtension,
                  },
                },
                model.key
              );
            }}
          >
            Save
          </Button>
        </context.UI.Design.Card>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppActionManageObjectTabExtensionIDetail;
