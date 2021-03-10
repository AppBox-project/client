import React, { useGlobal, useEffect, useState } from "reactn";
import {
  AppContextType,
  InterfaceType,
  ListDetailItemType,
  ModelType,
  ValueListItemType,
} from "../../../Utils/Types";
import { Fab, Grid, Tab, Tabs } from "@material-ui/core";
import AppSettingsInterfaceUI, {
  AppSettingsInterfaceUIOverview,
  InterfaceComponentsList,
} from "./Interface";
import AppSettingsInterfaceVariables from "./Variables";
import AppSettingsInterfaceLogic from "./Logic";
import AppSettingsInterfaceActions from "./Actions";
import { find } from "lodash";
import { FaSave } from "react-icons/fa";
import { DndProvider } from "react-dnd";
import MultiBackend from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch"; // or any other pipeline

const AppSettingsInterfaces: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [interfaces, setInterfaces] = useState<InterfaceType[]>();
  const [interfaceList, setInterfaceList] = useState<ListDetailItemType[]>();
  const [models, setModels] = useState<ModelType[]>();
  const [modelList, setModelList] = useState<ValueListItemType[]>();

  // Lifecycle
  useEffect(() => {
    const interfaceRequest = context.getObjects(
      "interfaces",
      {},
      (response) => {
        const nl: ListDetailItemType[] = [];
        response.data.map((interfaceObject: InterfaceType) =>
          nl.push({
            label: interfaceObject.data.name,
            id: interfaceObject.data.key,
          })
        );
        setInterfaceList(nl);
        setInterfaces(response.data);
      }
    );

    const modelRequest = context.getModels({}, (response) => {
      const nl: ValueListItemType[] = [];
      response.data.map((interfaceObject: ModelType) =>
        nl.push({
          label: interfaceObject.name_plural,
          value: interfaceObject.key,
        })
      );
      setModelList(nl);
      setModels(response.data);
    });

    return () => {
      interfaceRequest.stop();
      modelRequest.stop();
    };
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
      detailComponentProps={{
        interfaces,
        models,
        modelList,
      }}
      addFunction={() => {
        context.setDialog({
          display: true,
          title: "Add new interface",
          form: [
            { key: "name", label: "Name" },
            { key: "key", label: "Key" },
          ],
          buttons: [
            {
              label: "Create",
              onClick: (form) => {
                context.addObject(
                  "interfaces",
                  {
                    name: form.name,
                    key: form.key,
                    data: {
                      arguments: [],
                      interfaces: {
                        main: {
                          label: "Main UI",
                          content: [],
                        },
                      },
                      variables: {},
                      actions: {},
                      logic: {
                        steps: {},
                      },
                    },
                  },
                  (response) => {}
                );
              },
            },
          ],
        });
      }}
    />
  );
};

export default AppSettingsInterfaces;

const InterfaceWrapper: React.FC<{
  context: AppContextType;
  interfaces: InterfaceType[];
  match: { params: { detailId } };
  models: ModelType[];
  modelList: ValueListItemType[];
}> = ({
  context,
  match: {
    params: { detailId },
  },
  interfaces,
  models,
  modelList,
}) => {
  // Vars
  const [isMobile] = useGlobal<any>("isMobile");
  const [newInterface, setNewInterface] = useState<InterfaceType>();
  const [originalInterface, setOriginalInterface] = useState<string>();
  const [selectedInterface, setSelectedInterface] = useState<string>();

  // Lifecycle
  useEffect(() => {
    const interf = find(
      interfaces,
      (i: InterfaceType) => i.data.key === detailId
    );
    setNewInterface(interf);
    setOriginalInterface(JSON.stringify(interf));
  }, [detailId, interfaces]);

  // UI

  if (!newInterface) return <context.UI.Loading />;
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      {isMobile ? (
        <MobileLayout
          context={context}
          newInterface={newInterface}
          setNewInterface={setNewInterface}
          models={models}
          modelList={modelList}
          selectedInterface={selectedInterface}
          setSelectedInterface={setSelectedInterface}
        />
      ) : (
        <DesktopLayout
          context={context}
          newInterface={newInterface}
          setNewInterface={setNewInterface}
          models={models}
          modelList={modelList}
          selectedInterface={selectedInterface}
          setSelectedInterface={setSelectedInterface}
        />
      )}
      {originalInterface !== JSON.stringify(newInterface) && (
        <Fab
          style={{ position: "fixed", right: 15, bottom: 15, zIndex: 101 }}
          color="primary"
          onClick={() => {
            context.updateObject(
              "interfaces",
              newInterface.data,
              newInterface._id
            );
          }}
        >
          <FaSave />
        </Fab>
      )}
    </DndProvider>
  );
};

const DesktopLayout: React.FC<{
  context: AppContextType;
  newInterface: InterfaceType;
  setNewInterface: (newInterface) => void;
  models: ModelType[];
  modelList: ValueListItemType[];
  selectedInterface: string;
  setSelectedInterface;
}> = ({
  context,
  newInterface,
  setNewInterface,
  models,
  modelList,
  selectedInterface,
  setSelectedInterface,
}) => {
  const [leftTab, setLeftTab] = useState<"Interface" | "Logic">("Logic");
  const [rightTab, setRightTab] = useState<"Variables" | "Actions">(
    "Variables"
  );
  const [rightUITab, setRightUITab] = useState<"Interfaces" | "Components">(
    "Interfaces"
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
                  models={models}
                  modelList={modelList}
                />
              )}
              {leftTab === "Interface" && (
                <div style={{ margin: 15 }}>
                  <AppSettingsInterfaceUI
                    newInterface={newInterface}
                    context={context}
                    setNewInterface={setNewInterface}
                    models={models}
                    modelList={modelList}
                    selectedInterface={selectedInterface}
                    setSelectedInterface={setSelectedInterface}
                  />
                </div>
              )}
            </context.UI.Design.Card>
          </context.UI.Animations.AnimationItem>
        </Grid>
        <Grid item xs={4} style={{ height: "100%" }}>
          <context.UI.Animations.AnimationItem>
            <context.UI.Design.Card withBigMargin withoutPadding>
              {leftTab === "Logic" ? (
                <>
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
                      models={models}
                      modelList={modelList}
                    />
                  )}
                  {rightTab === "Actions" && (
                    <AppSettingsInterfaceActions
                      newInterface={newInterface}
                      context={context}
                      setNewInterface={setNewInterface}
                      models={models}
                      modelList={modelList}
                    />
                  )}
                </>
              ) : (
                <>
                  <Tabs
                    value={rightUITab}
                    onChange={(event, newValue) => {
                      setRightUITab(newValue);
                    }}
                    indicatorColor="primary"
                  >
                    <Tab label="Interfaces" value="Interfaces" />
                    {selectedInterface && (
                      <Tab label="Components" value="Components" />
                    )}
                  </Tabs>
                  {rightUITab === "Interfaces" && (
                    <AppSettingsInterfaceUIOverview
                      context={context}
                      newInterface={newInterface}
                      setNewInterface={setNewInterface}
                      setSelectedInterface={setSelectedInterface}
                      setRightUITab={setRightUITab}
                    />
                  )}
                  {rightUITab === "Components" && (
                    <InterfaceComponentsList
                      context={context}
                      newInterface={newInterface}
                      setNewInterface={setNewInterface}
                      setSelectedInterface={setSelectedInterface}
                      setRightUITab={setRightUITab}
                    />
                  )}
                </>
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
  models: ModelType[];
  modelList: ValueListItemType[];
  selectedInterface: string;
  setSelectedInterface;
}> = ({
  context,
  newInterface,
  setNewInterface,
  models,
  modelList,
  selectedInterface,
  setSelectedInterface,
}) => {
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
            models={models}
            modelList={modelList}
            selectedInterface={selectedInterface}
            setSelectedInterface={setSelectedInterface}
            Components={
              <InterfaceComponentsList
                context={context}
                newInterface={newInterface}
                setNewInterface={setNewInterface}
                setSelectedInterface={setSelectedInterface}
                setRightUITab={() => {}}
              />
            }
          />
        )}
        {currentTab === "Logic" && (
          <AppSettingsInterfaceLogic
            newInterface={newInterface}
            context={context}
            setNewInterface={setNewInterface}
            models={models}
            modelList={modelList}
          />
        )}
        {currentTab === "Variables" && (
          <AppSettingsInterfaceVariables
            newInterface={newInterface}
            context={context}
            setNewInterface={setNewInterface}
            models={models}
            modelList={modelList}
          />
        )}
        {currentTab === "Actions" && (
          <AppSettingsInterfaceActions
            newInterface={newInterface}
            context={context}
            setNewInterface={setNewInterface}
            models={models}
            modelList={modelList}
          />
        )}
      </context.UI.Design.Card>
    </context.UI.Animations.Animation>
  );
};
