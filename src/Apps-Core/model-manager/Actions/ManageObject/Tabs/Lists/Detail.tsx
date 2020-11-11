import React, { useEffect, useState } from "react";
import {
  AppContextType,
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
  }, []);
  // UI
  if (!list) return <context.UI.Loading />;
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <context.UI.Design.Card
          withBigMargin
          title={list.name}
          overflow="visible"
        >
          <context.UI.Inputs.Select
            options={permissions}
            label="Visible to (empty = everyone)"
            multiple
          />
        </context.UI.Design.Card>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppActionManageObjectTabListsDetail;
