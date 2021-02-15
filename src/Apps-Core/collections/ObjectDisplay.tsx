import React, { useEffect, useState } from "react";
import { AppContextType } from "../../Utils/Types";
import { find } from "lodash";

const CollectionsDisplayObject: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [currentAction, setCurrentAction] = useState<{
    key: string;
    label: string;
    icon: string;
    page: { type: "model"; model?: string };
  }>();

  // Lifecycle
  useEffect(() => {
    setCurrentAction(
      find(context.app.data.collection_data.actions, (o) => o.key === action)
    );
  }, [action]);

  // Functions

  // UI
  if (!currentAction) return <context.UI.Loading />;
  return (
    <context.UI.Object.Overview
      context={context}
      modelId={currentAction.page.model}
      baseUrl={`/${context.app.data.id}/${action}`}
      overviewId="default"
    />
  );
};

export default CollectionsDisplayObject;
