import React, { useGlobal, useEffect, useState } from "reactn";
import { AppContextType, ListDetailItemType } from "../../../Utils/Types";
import { InterfaceType } from "../Types";
import { Grid, Tab, Tabs } from "@material-ui/core";
import AppSettingsInterfaceUI from "./Interface";
import AppSettingsInterfaceVariables from "./Variables";
import AppSettingsInterfaceLogic from "./Logic";
import AppSettingsInterfaceActions from "./Actions";
import { find } from "lodash";

const AppSettingsInterfaces: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [interfaces, setInterfaces] = useState<InterfaceType[]>();
  const [interfaceList, setInterfaceList] = useState<ListDetailItemType[]>();

  // Lifecycle
  useEffect(() => {
    context.getObjects("interfaces", {}, (response) => {
      const nl: ListDetailItemType[] = [];
      response.data.map((interfaceObject: InterfaceType) =>
        nl.push({
          label: interfaceObject.data.name,
          id: interfaceObject.data.key,
        })
      );
      setInterfaceList(nl);
      setInterfaces(response.data);
    });
  }, []);

  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      list={interfaceList}
      DetailComponent={InterfaceWrapper}
      baseUrl="/settings/interfaces"
      title="Interfaces"
      navWidth={2}
      detailComponentProps={{ interfaces }}
    />
  );
};

export default AppSettingsInterfaces;

const InterfaceWrapper: React.FC<{
  context: AppContextType;
  interfaces: InterfaceType[];
  match: { params: { detailId } };
}> = ({
  context,
  match: {
    params: { detailId },
  },
  interfaces,
}) => {
  // Vars
  const [isMobile] = useGlobal<any>("isMobile");
  const [newInterface, setNewInterface] = useState<InterfaceType>();

  // Lifecycle
  useEffect(() => {
    setNewInterface(
      find(interfaces, (i: InterfaceType) => i.data.key === detailId)
    );
  }, [detailId, interfaces]);

  // UI

  if (!newInterface) return <context.UI.Loading />;
  return isMobile ? (
    <MobileLayout
      context={context}
      newInterface={newInterface}
      setNewInterface={setNewInterface}
    />
  ) : (
    <DesktopLayout
      context={context}
      newInterface={newInterface}
      setNewInterface={setNewInterface}
    />
  );
};

const DesktopLayout: React.FC<{
  context: AppContextType;
  newInterface: InterfaceType;
  setNewInterface: (newInterface) => void;
}> = ({ context, newInterface, setNewInterface }) => {
  const [leftTab, setLeftTab] = useState<"Interface" | "Logic">("Logic");
  const [rightTab, setRightTab] = useState<"Variables" | "Actions">(
    "Variables"
  );

  return (
    <context.UI.Animations.AnimationContainer>
      <Grid container style={{ height: "100%" }}>
        <Grid item xs={8} style={{ height: "100%" }}>
          <context.UI.Animations.AnimationItem>
            <context.UI.Design.Card withBigMargin withoutPadding>
              <Tabs
                value={leftTab}
                onChange={(event, newValue) => {
                  setLeftTab(newValue);
                }}
                indicatorColor="primary"
              >
                <Tab label="Logic" value="Logic" />
                <Tab label="Interface" value="Interface" />
              </Tabs>
              {leftTab === "Logic" && (
                <AppSettingsInterfaceLogic
                  newInterface={newInterface}
                  context={context}
                  setNewInterface={setNewInterface}
                />
              )}
              {leftTab === "Interface" && (
                <div style={{ margin: 15 }}>
                  <AppSettingsInterfaceUI
                    newInterface={newInterface}
                    context={context}
                    setNewInterface={setNewInterface}
                  />
                </div>
              )}
            </context.UI.Design.Card>
          </context.UI.Animations.AnimationItem>
        </Grid>
        <Grid item xs={4} style={{ height: "100%" }}>
          <context.UI.Animations.AnimationItem>
            <context.UI.Design.Card withBigMargin withoutPadding>
              <Tabs
                value={rightTab}
                onChange={(event, newValue) => {
                  setRightTab(newValue);
                }}
                indicatorColor="primary"
              >
                <Tab label="Variables" value="Variables" />
                <Tab label="Actions" value="Actions" />
              </Tabs>
              {rightTab === "Variables" && (
                <AppSettingsInterfaceVariables
                  newInterface={newInterface}
                  context={context}
                  setNewInterface={setNewInterface}
                />
              )}
              {rightTab === "Actions" && (
                <AppSettingsInterfaceActions
                  newInterface={newInterface}
                  context={context}
                  setNewInterface={setNewInterface}
                />
              )}
            </context.UI.Design.Card>
          </context.UI.Animations.AnimationItem>
        </Grid>
      </Grid>
    </context.UI.Animations.AnimationContainer>
  );
};
const MobileLayout: React.FC<{
  context: AppContextType;
  newInterface: InterfaceType;
  setNewInterface: (newInterface) => void;
}> = ({ context, newInterface, setNewInterface }) => {
  const [currentTab, setCurrentTab] = useState<
    "Interface" | "Logic" | "Variables" | "Actions"
  >("Interface");

  return (
    <context.UI.Animations.Animation>
      <context.UI.Design.Card withBigMargin withoutPadding>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
          }}
          indicatorColor="primary"
        >
          <Tab label="Interface" value="Interface" />
          <Tab label="Logic" value="Logic" />
          <Tab label="Variables" value="Variables" />
          <Tab label="Actions" value="Actions" />
        </Tabs>
        {currentTab === "Interface" && (
          <AppSettingsInterfaceUI
            newInterface={newInterface}
            context={context}
            setNewInterface={setNewInterface}
          />
        )}
        {currentTab === "Logic" && (
          <AppSettingsInterfaceLogic
            newInterface={newInterface}
            context={context}
            setNewInterface={setNewInterface}
          />
        )}
        {currentTab === "Variables" && (
          <AppSettingsInterfaceVariables
            newInterface={newInterface}
            context={context}
            setNewInterface={setNewInterface}
          />
        )}
        {currentTab === "Actions" && (
          <AppSettingsInterfaceActions
            newInterface={newInterface}
            context={context}
            setNewInterface={setNewInterface}
          />
        )}
      </context.UI.Design.Card>
    </context.UI.Animations.Animation>
  );
};
