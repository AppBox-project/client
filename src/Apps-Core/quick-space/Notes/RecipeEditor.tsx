import React, { useState, useEffect } from "react";
import { CustomFieldType } from "../../../Utils/Types";
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import { FaPepperHot } from "react-icons/fa";
import { AppProjectType } from "../Types";

interface IngredientType {
  name: string;
  quantity: number;
  quantityDescriptor?: string;
}

const CERecipeEditor: React.FC<CustomFieldType> = ({
  mode,
  value,
  context,
  onChange,
}) => {
  // States
  const [newValue, setNewvalue] = useState<any>();

  // Lifecycle
  useEffect(() => {
    setNewvalue(value);
  }, [value]);

  // UI
  if (mode === "view") {
    // View mode: For when we're looking at data
    return (
      <>
        <Typography variant="h6">Ingredients</Typography>
        <Button
          fullWidth
          color="primary"
          onClick={() => {
            context
              .getObjects(
                "qs-project",
                {
                  "data.owner": context.user._id,
                  "data.show_in_todos": { $ne: false },
                  "data.todos_type": "Groceries",
                },
                (response) => {
                  if (response.success) {
                    const projects = [];
                    const defaultList = response.data[0]._id;
                    response.data.map((p: AppProjectType) => {
                      projects.push({
                        label: p.data.name,
                        value: p._id,
                      });
                    });
                    context.setDialog({
                      display: true,
                      title: "Add to shopping list",
                      form: [
                        {
                          key: "people",
                          type: "number",
                          label: "How many people will eat?",
                          value: (newValue || {}).people || 2,
                        },
                        {
                          key: "project",
                          type: "dropdown",
                          dropdownOptions: projects,
                          label: "List to add to",
                          value: defaultList,
                        },
                      ],
                      buttons: [
                        {
                          label: "Add",
                          onClick: (form) => {
                            const groceriesToAdd = [];
                            ((newValue || {}).ingredients || []).map(
                              (ingredient) => {
                                const amount =
                                  (ingredient.quantity /
                                    (newValue?.people || 1)) *
                                  form.people;
                                groceriesToAdd.push({
                                  action: `${amount > 0 ? amount : ""}${
                                    ingredient.quantityDescriptor !== undefined
                                      ? ingredient.quantityDescriptor
                                      : ""
                                  } ${ingredient.name}`,
                                  owner: context.user._id,
                                  project: form.project,
                                });
                              }
                            );
                            context.addObjects(
                              "qs-todo",
                              groceriesToAdd,
                              (response) => {
                                console.log("now weset snackbar");
                              }
                            );
                          },
                        },
                      ],
                    });
                  } else {
                    console.log(response);
                  }
                }
              )
              .stop();
          }}
        >
          Add to shopping list
        </Button>
      </>
    );
  } else {
    // Edit mode
    return (
      <>
        <Typography variant="h6">Ingredients</Typography>
        <Typography variant="body1">
          For{" "}
          <input
            type="number"
            style={{ display: "inline-block", width: 25 }}
            value={(newValue || {}).people || 2}
            onChange={(e) => {
              setNewvalue({ ...newValue, people: e.target.value });
              onChange({ ...newValue, people: e.target.value });
            }}
          />{" "}
          {parseInt((newValue || {}).people) === 1 ? "person" : "people"}
        </Typography>
        <List>
          {(newValue?.ingredients || []).map(
            (ingredient: IngredientType, ingredientIndex) => (
              <ListItem style={{ paddingLeft: 0, display: "flex" }}>
                <div style={{ width: 100 }}>
                  <input
                    type="number"
                    style={{ display: "inline-block", width: 35 }}
                    value={ingredient.quantity}
                    onChange={(e) => {
                      const updatedValue = newValue;
                      updatedValue.ingredients[ingredientIndex].quantity =
                        e.target.value;
                      setNewvalue(updatedValue);
                      onChange(updatedValue);
                    }}
                  />
                  <context.UI.Inputs.SelectInput
                    value={ingredient.quantityDescriptor}
                    onChange={(quantityDescriptor) => {
                      const updatedValue = newValue;
                      updatedValue.ingredients[
                        ingredientIndex
                      ].quantityDescriptor = quantityDescriptor;
                      setNewvalue(updatedValue);
                      onChange(updatedValue);
                    }}
                    style={{
                      display: "inline-block",
                      width: 40,
                      marginTop: -25,
                      marginLeft: 10,
                    }}
                    options={[
                      { label: "mg", value: "mg" },
                      { label: "g", value: "g" },
                      { label: "kg", value: "kg" },
                      { label: "ml", value: "ml" },
                      { label: "cl", value: "cl" },
                      { label: "l", value: "l" },
                      { label: "a tad", value: "x" },
                      { label: "pcs", value: "pcs" },
                    ]}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={ingredient.name}
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      const updatedValue = newValue;
                      updatedValue.ingredients[ingredientIndex].name =
                        e.target.value;
                      setNewvalue(updatedValue);
                      onChange(updatedValue);
                    }}
                  />
                </div>
              </ListItem>
            )
          )}
          <ListItem
            button
            onClick={() => {
              const updatedValue = newValue || {};
              updatedValue.ingredients = updatedValue?.ingredients || [];
              updatedValue.ingredients.push({
                quantity: 1,
                name: "red pepper",
              });
              onChange(updatedValue);
              setNewvalue(updatedValue);
            }}
          >
            <ListItemIcon style={{ width: 30, minWidth: 30 }}>
              <FaPepperHot />
            </ListItemIcon>
            <ListItemText>Add ingredient</ListItemText>
          </ListItem>
        </List>
      </>
    );
  }
};

export default CERecipeEditor;
