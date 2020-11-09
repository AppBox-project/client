import { Button, Divider, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { AppContextType, SystemTaskType } from "../../Utils/Types";
import Install from "./Install";
import { StoreAppType } from "./Types";
import AppHubWizard from "./Wizard";

const AppHubApp: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  const appId = window.location.href.split("/app-hub/browse/")[1];

  // Vars
  const [app, setApp] = useState<StoreAppType>();
  const [state, setState] = useState<"view" | "wizard" | "installing">("view");
  const [task, setTask] = useState<SystemTaskType>();
  const [choices, setChoices] = useState<{}>({});
  // Functions
  const onInstall = () => {
    setState(app.data.wizard ? "wizard" : "installing");
  };

  // Lifecycle
  useEffect(() => {
    context
      .getDataFromExternalApi(
        `https://appbox.vicvancooten.nl/api/appbox-app/read/?baseUrl=base&key=${appId}`
      )
      .then((data: StoreAppType) => setApp(data[0]))
      .catch((err) => console.error(err));
  }, []);

  // Set banner
  useEffect(() => {
    if (app) context.setImage(app?.data?.banner?.url);
    return () => context.setImage(null);
  }, [app]);

  // UI
  if (!app) return <context.UI.Loading />;
  return state === "view" ? (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <context.UI.Design.Card withBigMargin title={app.data.name}>
          <Grid container>
            <Grid item xs={11}>
              <Typography variant="h6" style={{ fontSize: 16 }}>
                {app.data.summary}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<FaShoppingBag />}
                onClick={onInstall}
              >
                Install
              </Button>
            </Grid>
          </Grid>
          <Divider style={{ margin: "10px 0" }} />
          <context.UI.Animations.AnimationContainer>
            <Grid container>
              {[1, 2, 3, 4, 5].map((item) => (
                <Grid item xs={2} key={item}>
                  <context.UI.Animations.AnimationItem>
                    <context.UI.Design.Card
                      style={{ height: 150 }}
                      withBigMargin
                      title={`Screenshot #${item}`}
                      centerTitle
                      titleDivider
                      titleInPrimaryColor
                    >
                      {" "}
                    </context.UI.Design.Card>
                  </context.UI.Animations.AnimationItem>
                </Grid>
              ))}
            </Grid>
          </context.UI.Animations.AnimationContainer>
          <Divider style={{ margin: "10px 0" }} />
          <div dangerouslySetInnerHTML={{ __html: app.data.description }} />
        </context.UI.Design.Card>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  ) : state === "wizard" ? (
    <AppHubWizard
      context={context}
      app={app}
      onProgress={(choices) => {
        console.log(choices);

        setChoices(choices);
        setState("installing");
      }}
    />
  ) : (
    <Install context={context} choices={choices} app={app} />
  );
};

export default AppHubApp;
