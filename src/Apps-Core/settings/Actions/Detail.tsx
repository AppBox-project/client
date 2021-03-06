import React, { useEffect, useState } from "react";
import { useGlobal } from "reactn";
import {
  AppContextType,
  ModelType,
  ValueListItemType,
} from "../../../Utils/Types";
import { ActionType, ActionVarType } from "../Types";
import find from "lodash/find";
import { Fab, Grid, Tab, Tabs } from "@material-ui/core";
import { FaSave } from "react-icons/fa";
import SettingsActionsVars from "./Variables";
import SettingsActionsLogic from "./Logic";
import map from "lodash/map";
import SettingsActionsTriggers from "./Triggers";
import SettingsActionsSettings from "./Settings";

const SettingsActionsDetail: React.FC<{
  match: { params: { detailId } };
  context: AppContextType;
  actions: ActionType[];
}> = ({
  context,
  match: {
    params: { detailId },
  },
  actions,
}) => {
  // Vars
  const [originalAction, setOriginalAction] = useState<string>();
  const [action, setAction] = useState<ActionType>();
  const [selectedLeftTab, setSelectedLeftTab] = useState<
    "Settings" | "Triggers" | "Logic" | "Variables"
  >("Settings");
  const [models, setModels] = useState<ModelType[]>();
  const [modelList, setModelList] = useState<ValueListItemType[]>();
  const [varList, setVarList] = useState<ValueListItemType[]>();
  const [isMobile] = useGlobal<any>("isMobile");

  // Lifecycle
  useEffect(() => {
    const act: ActionType = find(actions, (o) => o.data.key === detailId);
    setAction(act);
    setOriginalAction(JSON.stringify(act));

    const modelRequest = context.getModels({}, (response) => {
      const nl: ValueListItemType[] = [];
      response.data.map((m: ModelType) =>
        nl.push({
          label: m.name_plural,
          value: m.key,
          args: m,
        })
      );
      setModelList(nl);
      setModels(response.data);
    });

    return () => modelRequest.stop();
  }, [actions, detailId]);

  useEffect(() => {
    const nl: ValueListItemType[] = [];
    map(action?.data?.data?.vars || [], (vari: ActionVarType, value) =>
      nl.push({ label: vari.label, value, args: vari })
    );
    setVarList(nl);
  }, [action]);

  // UI
  if (!action) return <context.UI.Loading />;
  return (
    <>
      <context.UI.Animations.AnimationContainer>
        <Grid container>
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            <context.UI.Animations.AnimationItem>
              <context.UI.Design.Card withBigMargin withoutPadding>
                <Tabs
                  value={selectedLeftTab}
                  onChange={(event, newValue) => setSelectedLeftTab(newValue)}
                  aria-label="Edit action"
                >
                  <Tab label="Settings" value="Settings" />
                  {isMobile && <Tab label="Variables" value="Variables" />}
                  <Tab label="Triggers" value="Triggers" />
                  <Tab label="Logic" value="Logic" />
                </Tabs>
                <div style={{ margin: 15 }}>
                  {selectedLeftTab === "Settings" && (
                    <SettingsActionsSettings
                      context={context}
                      action={action}
                      setAction={setAction}
                      models={models}
                    />
                  )}
                  {selectedLeftTab === "Triggers" && (
                    <SettingsActionsTriggers
                      context={context}
                      action={action}
                      setAction={setAction}
                      modelList={modelList}
                      varList={varList}
                      models={models}
                    />
                  )}
                  {selectedLeftTab === "Logic" && (
                    <SettingsActionsLogic
                      context={context}
                      action={action}
                      setAction={setAction}
                      modelList={modelList}
                      varList={varList}
                      models={models}
                    />
                  )}
                  {selectedLeftTab === "Variables" && (
                    <SettingsActionsVars
                      context={context}
                      action={action}
                      setAction={setAction}
                      modelList={modelList}
                    />
                  )}
                </div>
              </context.UI.Design.Card>
            </context.UI.Animations.AnimationItem>
          </Grid>
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <context.UI.Animations.AnimationItem>
                <context.UI.Design.Card
                  withBigMargin
                  title="Variables"
                  withoutPadding
                  centerTitle
                  titleInPrimaryColor
                  titleDivider
                >
                  <SettingsActionsVars
                    context={context}
                    action={action}
                    setAction={setAction}
                    modelList={modelList}
                  />
                </context.UI.Design.Card>
              </context.UI.Animations.AnimationItem>
            </Grid>
          )}
        </Grid>
      </context.UI.Animations.AnimationContainer>
      {JSON.stringify(action) !== originalAction && (
        <Fab
          style={{ position: "absolute", bottom: 84, right: 15 }}
          color="primary"
          onClick={() =>
            context.updateObject("actions", action.data, action._id)
          }
        >
          <FaSave />
        </Fab>
      )}
    </>
  );
};

export default SettingsActionsDetail;
