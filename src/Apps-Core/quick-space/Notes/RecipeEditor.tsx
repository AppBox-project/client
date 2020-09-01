import React from "react";
import { CustomFieldType } from "../../../Utils/Types";
import { Button } from "@material-ui/core";

const CERecipeEditor: React.FC<CustomFieldType> = ({
  mode,
  value,
  context,
}) => {
  const newValue = value;

  if (mode === "view") {
    return (
      <>
        {JSON.stringify(newValue || {})}
        <Button
          fullWidth
          color="primary"
          onClick={() => {
            context.setDialog({
              display: true,
              title: "Add to shopping list",
              form: [
                {
                  key: "people",
                  type: "number",
                  label: "How many people will eat?",
                },
              ],
            });
          }}
        >
          Add to shopping list
        </Button>
      </>
    );
  } else {
    return <>{JSON.stringify(newValue)}</>;
  }
};

export default CERecipeEditor;
