import { Button, Divider, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ObjectDesigner from "../../../../../../Components/ObjectDesigner/Filter";
import {
  AppContextType,
  ModelListType,
  ModelType,
  ValueListItemType,
} from "../../../../../../Utils/Types";

const AppActionManageObjectTabListsDetail: React.FC<{
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
  // Vars
  const [permissions, setPermissions] = useState<ValueListItemType[]>([]);
  const list = model?.lists[detailId];
  const [newValue, setNewValue] = useState<ModelListType>(list);

  // Lifecycle
  useEffect(() => {
    const request = context.getObjects("permissions", {}, (response) => {
      if (response.success) {
        const np: ValueListItemType[] = [];
        response.data.map((r) =>
          np.push({ label: r.data.name, value: r.data.name })
        );
        setPermissions(np);
      } else {
        console.log(response);
      }
    });

    return () => {
      request.stop();
    };
  }, []);

  useEffect(() => {
    setNewValue(list);
  }, [list]);

  // UI
  if (!list) return <context.UI.Loading />;
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <context.UI.Design.Card
          withBigMargin
          title={newValue.name}
          overflow="visible"
        >
          <Typography variant="h6">About the list</Typography>
          <Divider />
          <context.UI.Inputs.TextInput
            value={newValue.name}
            onChange={(value) => {
              setNewValue({ ...newValue, name: value });
            }}
            label="List name"
          />
          <context.UI.Inputs.Select
            options={permissions}
            label="Visible to (empty = everyone)"
            multiple
            value={newValue.visibleFor}
            onChange={(value) => {
              setNewValue({ ...newValue, visibleFor: value });
            }}
          />

          <Typography variant="h6">List filters</Typography>
          <Divider />
          <ObjectDesigner
            value={newValue.filter}
            onChange={(value) => {
              setNewValue({ ...newValue, filter: value });
            }}
            context={context}
            model={model}
            modelId={model.key}
          />
          <Button
            fullWidth
            color="primary"
            onClick={() => {
              context.updateModel(
                model.key,
                { ...model, lists: { ...model.lists, [detailId]: newValue } },
                model._id
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

export default AppActionManageObjectTabListsDetail;
