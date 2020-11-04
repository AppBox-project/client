import React from "react";
import { AppContextType } from "../../Utils/Types";

const AppHubWizard: React.FC<{ context: AppContextType }> = ({ context }) => {
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <context.UI.Design.Card title="Wizard 🧙‍♂️" withBigMargin>
          Wizard
        </context.UI.Design.Card>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppHubWizard;
