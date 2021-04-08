import React, { useEffect, useState } from "react";
import { AppContextType } from "../../Utils/Types";
import find from "lodash/find";
import RenderInterface from "../../Components/RenderInterface";

const CollectionsDisplayInterface: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [currentAction, setCurrentAction] = useState<{
    key: string;
    label: string;
    icon: string;
    page: { type: "model"; model?: string; interface?: string };
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
    <RenderInterface
      context={context}
      interfaceId={currentAction.page.interface}
    />
  );
};

export default CollectionsDisplayInterface;
