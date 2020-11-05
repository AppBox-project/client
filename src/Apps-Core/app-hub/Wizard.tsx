import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import InputSelect from "../../Components/Inputs/Select";
import { AppContextType } from "../../Utils/Types";
import { StoreAppType } from "./Types";

const AppHubWizard: React.FC<{
  context: AppContextType;
  app: StoreAppType;
  onProgress: (choices: {}) => void;
}> = ({ context, app, onProgress }) => {
  const [choices, setChoices] = useState<{}>({});
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <context.UI.Design.Card
          title={`Installing ${app.data.name} 🧙‍♂️`}
          withBigMargin
        >
          {app.data.wizard.intro}
          {app.data.wizard.fields.map((field) => {
            if (!choices[field.key])
              setChoices({
                ...choices,
                [field.key]: field.options[0].value,
              });

            return field.type === "options" ? (
              <InputSelect
                label={field.label}
                options={field.options}
                value={choices[field.key] || field.options[0].value}
                onChange={(value) =>
                  setChoices({ ...choices, [field.key]: value.value })
                }
                style={{ margin: "15px 0" }}
              />
            ) : (
              `Unknown type ${field.type}`
            );
          })}
          <Button
            variant="contained"
            fullWidth
            color="primary"
            startIcon={<FaShoppingBag />}
            style={{ margin: "15px 0" }}
            onClick={() => {
              onProgress(choices);
            }}
          >
            Install
          </Button>
        </context.UI.Design.Card>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppHubWizard;
