import React, { useEffect } from "react";
import { AppContextType } from "../../../../Utils/Types";
import AppQSSettingsProjectDetail from "./Detail";
import { useState } from "reactn";
import { ListItemType } from "../../../../Utils/Types";
import array2dTo3d from "../../../../Utils/Functions/array2dTo3d";
import {
  ListItem,
  Divider,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import { FaProjectDiagram } from "react-icons/fa";
import { useHistory } from "react-router-dom";

const AppSettingsProject: React.FC<{
  context: AppContextType;
  isMobile: boolean;
}> = ({ context, isMobile }) => {
  // Vars
  const [projects, setProjects] = useState<{}>([]);
  const [projectsList, setProjectsList] = useState<ListItemType[]>([]);
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    context.getObjects(
      "qs-project",
      { "data.owner": context.user._id },
      (response) => {
        const pList = {};
        if (response.success) {
          const pl = array2dTo3d(
            response.data,
            "data.parent",
            true,
            "data.name"
          );
          response.data.map((p) => (pList[p._id] = p));
          setProjects(pList);
          setProjectsList(pl);
        } else {
          console.log(response);
        }
      }
    );
  }, []);

  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      baseUrl="/quick-space/settings/projects"
      DetailComponent={AppQSSettingsProjectDetail}
      detailComponentProps={{ projects, isMobile }}
      context={context}
      list={projectsList}
      title="Projects"
      customNavItems={[
        <>
          <ListItem
            button
            onClick={() =>
              history.push("/quick-space/settings/projects/settings")
            }
          >
            <ListItemIcon>
              <FaProjectDiagram />
            </ListItemIcon>
            <ListItemText>Project settings</ListItemText>
          </ListItem>
          <Divider />
        </>,
      ]}
      addFunction={() => {
        context.setDialog({
          display: true,
          title: "New project",
          content: (
            <context.UI.Layouts.Object.ObjectLayout
              modelId="qs-project"
              layoutId="create"
              popup
              context={context}
              defaults={{ owner: context.user._id }}
            />
          ),
        });
      }}
      style={{ paddingBottom: isMobile && 60 }}
    />
  );
};

export default AppSettingsProject;
