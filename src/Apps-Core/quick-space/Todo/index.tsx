import React, { useState, useEffect, useGlobal } from "reactn";
import { AppContextType, ListDetailItemType } from "../../../Utils/Types";
import AppQSActionTodoDetail from "./DetailComponent";
import array2dTo3d from "../../../Utils/Functions/array2dTo3d";
import { AppProjectType } from "../Types";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const AppQSActionTodo: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [projects, setProjects] = useState<ListDetailItemType[]>();
  const [sharedProjects, setSharedProjects] = useState<AppProjectType[]>();
  const [flatProjects, setFlatProjects] = useState<{
    [key: string]: AppProjectType;
  }>();
  const [isMobile] = useGlobal<any>("isMobile");
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    const newFP = {};
    const projectRequest = context.getObjects(
      "qs-project",
      {
        "data.owner": context.user._id,
        "data.show_in_todos": true,
        "data.active": { $ne: false },
      },
      (response) => {
        if (response.success) {
          setProjects(
            array2dTo3d(response.data, "data.parent", true, "data.name", [
              "data.order",
            ])
          );
          response.data.map((o: AppProjectType) => (newFP[o._id] = o));
          setFlatProjects(newFP);
        } else {
          console.log(response);
        }
      }
    );
    // Shared with me
    const sharedProjectRequest = context.getObjects(
      "qs-project",
      {
        "data.shared_with": { $all: [context.user._id] },
        "data.show_in_todos": true,
        "data.active": { $ne: false },
      },
      (response) => {
        if (response.success) {
          setSharedProjects(response.data);
          response.data.map((o: AppProjectType) => (newFP[o._id] = o));
          setFlatProjects(newFP);
        } else {
          console.log(response);
        }
      }
    );
    return () => {
      projectRequest.stop();
      sharedProjectRequest.stop();
    };
  }, []);

  // UI
  if (!projects) return <context.UI.Loading />;

  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      baseUrl="/quick-space/todo"
      list={projects}
      navWidth={2}
      DetailComponent={AppQSActionTodoDetail}
      detailComponentProps={{ projects: flatProjects }}
      style={{ paddingBottom: isMobile && 50 }}
      title="Todos"
      footerComponent={
        (sharedProjects || []).length > 0 && (
          <context.UI.Design.Card
            withBigMargin
            withoutPadding
            title="Shared with me"
            titleDivider
            titleInPrimaryColor
            centerTitle
          >
            <List>
              {sharedProjects.map((project: AppProjectType) => (
                <ListItem
                  button
                  onClick={() => {
                    history.push(`/quick-space/todo/${project._id}`);
                  }}
                >
                  <ListItemText>{project.data.name}</ListItemText>
                </ListItem>
              ))}
            </List>
          </context.UI.Design.Card>
        )
      }
    />
  );
};

export default AppQSActionTodo;
