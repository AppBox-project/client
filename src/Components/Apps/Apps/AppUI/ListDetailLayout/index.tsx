import React, { useState, useGlobal } from "reactn";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Hidden,
  ListItemIcon,
} from "@material-ui/core";
import { Link, Route } from "react-router-dom";
import { AnimationContainer, AnimationItem } from "../Animations";
import { AppContextType } from "../../../../../Utils/Types";
import ActionBar from "../../../../ActionBar";
import { FaPlus } from "react-icons/fa";

/*
 * This UI element provides a lay-out that consists of a list of items and a detail component.
 * On desktop these will be displayed next to one another. On mobile only one of the two will show up.
 */

const ListDetailLayout: React.FC<{
  list: { label: string; id: string; url?: string }[];
  baseUrl: string;
  customNavComponent?;
  DetailComponent: React.FC;
  detailComponentProps?: {};
  context: AppContextType;
  addFunction?: () => void;
}> = ({
  list,
  customNavComponent,
  baseUrl,
  DetailComponent,
  detailComponentProps,
  context,
  addFunction,
}) => {
  // Vars
  const selectedItem = window.location.href.split(`${baseUrl}/`)[1];
  const [isMobile] = useGlobal<any>("isMobile");

  // Lifecycle
  // UI
  return (
    <Grid container>
      {(!selectedItem || !isMobile) && (
        <Grid item xs={12} md={3}>
          {customNavComponent ? (
            customNavComponent
          ) : (
            <List>
              <AnimationContainer>
                {addFunction && (
                  <AnimationItem>
                    <ListItem button onClick={addFunction}>
                      <ListItemIcon>
                        <FaPlus />
                      </ListItemIcon>
                      <ListItemText>Add new</ListItemText>
                    </ListItem>
                  </AnimationItem>
                )}
                {list.map((listItem) => {
                  return listItem.url ? (
                    <AnimationItem key={listItem.id}>
                      <Link to={`${baseUrl}/${listItem.url}`}>
                        <ListItem
                          button
                          selected={selectedItem === listItem.id}
                        >
                          <ListItemText>{listItem.label}</ListItemText>
                        </ListItem>
                      </Link>
                    </AnimationItem>
                  ) : (
                    <ListItem button>
                      <ListItemText>{listItem.label}</ListItemText>
                    </ListItem>
                  );
                })}
              </AnimationContainer>
            </List>
          )}
        </Grid>
      )}
      {selectedItem && (
        <Grid item xs={12} md={9} style={{ padding: 15 }}>
          <Route
            path={`${baseUrl}/:detailId`}
            render={(props) => {
              return (
                <>
                  {isMobile && <ActionBar backUrl={baseUrl} />}
                  <DetailComponent
                    {...props}
                    {...detailComponentProps}
                    context={context}
                  />
                </>
              );
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default ListDetailLayout;
