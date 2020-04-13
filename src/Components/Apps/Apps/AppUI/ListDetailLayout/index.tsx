import React, { useState } from "react";
import { Grid, List, ListItem, ListItemText } from "@material-ui/core";
import { Link, Route } from "react-router-dom";
import { AnimationContainer, AnimationItem } from "../Animations";
import { AppContextType } from "../../../../../Utils/Types";

const ListDetailLayout: React.FC<{
  list: { label: string; id: string; url?: string }[];
  baseUrl: string;
  customNavComponent?;
  DetailComponent: React.FC;
  detailComponentProps?: {};
  context: AppContextType;
}> = ({
  list,
  customNavComponent,
  baseUrl,
  DetailComponent,
  detailComponentProps,
  context,
}) => {
  // Vars
  const [selectedItem, setSelectedItem] = useState();
  // Lifecycle
  // UI
  return (
    <Grid container>
      <Grid item xs={12} md={3}>
        {customNavComponent ? (
          customNavComponent
        ) : (
          <List>
            <AnimationContainer>
              {list.map((listItem) => {
                return listItem.url ? (
                  <AnimationItem key={listItem.id}>
                    <Link to={`${baseUrl}/${listItem.url}`}>
                      <ListItem button selected={selectedItem}>
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
      <Grid item xs={12} md={9} style={{ padding: 15 }}>
        <Route
          path="/:appId/:modelId/overviews/:detailId"
          render={(props) => {
            return (
              <DetailComponent
                {...props}
                {...detailComponentProps}
                setCurrentItem={setSelectedItem}
                context={context}
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ListDetailLayout;
