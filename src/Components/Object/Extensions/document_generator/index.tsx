import { List, ListItem, ListSubheader, Typography } from "@material-ui/core";
import React from "react";
import { AppContextType, ObjectType } from "../../../../Utils/Types";

export default (
  extension,
  context: AppContextType,
  object: ObjectType = undefined
) =>
  new Promise((resolve, reject) => {
    context.getObjects(
      "document-template",
      { "data.model": object.objectId },
      (response) => {
        resolve({
          provides: {
            buttons: {
              configure: {
                label: "Generate",
                variant: "outlined",
                onClick: (event) => {
                  context.setDialog({
                    display: true,
                    title: "Generate document",
                    content: (
                      <List>
                        <ListSubheader>Pick a template</ListSubheader>
                        {response.data.map((template) => (
                          <ListItem
                            button
                            key={template._id}
                            onClick={() => {
                              context.requestServerAction("generateDocument", {
                                objectId: object._id,
                                template: template._id,
                              });
                            }}
                          >
                            {template.data.name}
                          </ListItem>
                        ))}
                      </List>
                    ),
                  });
                },
              },
            },
          },
        });
      }
    );
  });
