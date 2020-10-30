import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { FaBezierCurve, FaPlusCircle, FaRobot } from "react-icons/fa";
import { AppContextType } from "../../../Utils/Types";
import { AutomationType } from "../Types";
import Detail from "./Detail";
import { useHistory } from "react-router-dom";

const AppSettingsProcesses: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [automations, setAutomations] = useState<AutomationType[]>();
  const [processes, setProcesses] = useState<AutomationType[]>();
  const [automationList, setAutomationList] = useState<AutomationType[]>();

  // Lifecycle
  useEffect(() => {
    context.getObjects("system-automations", {}, (response) => {
      if (response.success) {
        const na: AutomationType[] = [];
        const np: AutomationType[] = [];
        response.data.map((automation: AutomationType) =>
          automation.data.type === "Automation"
            ? na.push(automation)
            : np.push(automation)
        );
        setAutomations(na);
        setProcesses(np);
        setAutomationList(response.data);
      } else {
        console.log(response);
      }
    });
  }, []);

  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      CustomNavComponent={NavComponent}
      context={context}
      baseUrl="/settings/automations"
      DetailComponent={Detail}
      navComponentProps={{ automations, processes }}
      detailComponentProps={{ context, automationList }}
      navWidth={4}
    />
  );
};

const NavComponent: React.FC<{
  context: AppContextType;
  automations: AutomationType[];
  processes: AutomationType[];
}> = ({ context, automations, processes }) => {
  // Vars
  const history = useHistory();

  // UI
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <context.UI.Design.Card title="Automations" withBigMargin>
          "When something happens, perform action(s)"
          <List>
            {automations ? (
              <>
                {automations.length > 0 ? (
                  automations.map((automation) => (
                    <ListItem
                      key={automation._id}
                      button
                      onClick={() => {
                        history.push(`/settings/automations/${automation._id}`);
                      }}
                    >
                      <ListItemIcon>
                        <FaRobot />
                      </ListItemIcon>
                      <ListItemText>{automation.data.name}</ListItemText>
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText>No automations yet.</ListItemText>
                  </ListItem>
                )}
                <ListItem
                  button
                  onClick={() => {
                    context.addObject(
                      "system-automations",
                      { type: "Automation", name: "New automation" },
                      (response) => {
                        console.log(response);
                      }
                    );
                  }}
                >
                  <ListItemIcon>
                    <FaPlusCircle />
                  </ListItemIcon>
                  <ListItemText>New automation</ListItemText>
                </ListItem>
              </>
            ) : (
              <ListItem>
                <Skeleton style={{ width: "100%" }} />
              </ListItem>
            )}
          </List>
        </context.UI.Design.Card>
      </context.UI.Animations.AnimationItem>
      <context.UI.Animations.AnimationItem>
        <context.UI.Design.Card title="Processes" withBigMargin>
          More complex automations, with variables and multiple steps.
          <List>
            {processes ? (
              <>
                {processes.length > 0 ? (
                  processes.map((process) => (
                    <ListItem
                      key={process._id}
                      button
                      onClick={() => {
                        history.push(`/settings/automations/${process._id}`);
                      }}
                    >
                      <ListItemIcon>
                        <FaBezierCurve />
                      </ListItemIcon>

                      <ListItemText>{process.data.name}</ListItemText>
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText>No processes yet.</ListItemText>
                  </ListItem>
                )}
                <ListItem
                  button
                  onClick={() => {
                    context.addObject(
                      "system-automations",
                      { type: "Process", name: "New process" },
                      (response) => {
                        console.log(response);
                      }
                    );
                  }}
                >
                  <ListItemIcon>
                    <FaPlusCircle />
                  </ListItemIcon>
                  <ListItemText>New process</ListItemText>
                </ListItem>
              </>
            ) : (
              <ListItem>
                <Skeleton style={{ width: "100%" }} />
              </ListItem>
            )}
          </List>
        </context.UI.Design.Card>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppSettingsProcesses;
