import React, { useGlobal, useEffect, useState } from "reactn";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Hidden,
} from "@material-ui/core";
import Loading from "../../Loading";
import { AppContextType, dialogType } from "../../../Utils/Types";
import { AppContext } from "./AppContext";
import { TextInput } from "./AppUI/Forms";
import AppUIDesktop from "./AppUI/DesktopLayout";
import AppUIMobile from "./AppUI/MobileLayout";
import Select from "./AppUI/Forms/Select";

const App: React.FC<{
  match: { params: { appId } };
  setCurrentApp: (string) => void;
}> = ({
  match: {
    params: { appId },
  },
  setCurrentApp,
}) => {
  const [appContext, setAppcontext] = useState<AppContextType>();
  const [currentPage, setCurrentPage] = useState();
  const [dialog, setDialog] = useState<dialogType>();
  const [dialogFormContent, setDialogFormContent] = useState();
  const [gTheme, setgTheme] = useGlobal<any>("theme");
  const [gApp, setgApp] = useGlobal<any>("app");
  const [navBar, setNavBar] = useGlobal<any>("navBar");
  const [appButtons, setAppButtons] = useState({});

  //Lifecycle
  useEffect(() => {
    setCurrentApp(appId);
    const context = new AppContext(appId, setDialog, appButtons, setAppButtons);
    context.isReady.then(() => {
      //@ts-ignore
      setAppcontext(context);
      const newColor = `rgb(${context.app.data.color.r},${context.app.data.color.g},${context.app.data.color.b})`;
      var metaThemeColor = document.querySelector("meta[name=theme-color]");
      metaThemeColor.setAttribute("content", newColor);
      setgApp(context.app);
      setgTheme({
        ...gTheme,
        palette: {
          ...gTheme.palette,
          primary: {
            ...gTheme.palette.primary,
            main: newColor,
          },
        },
      });
    });
    return () => {
      setCurrentApp(null);
      setAppcontext(null);
      setAppButtons(null);
      setNavBar({
        ...navBar,
        buttons: {},
      });

      setgApp(null);
      setDialog({
        ...dialog,
        display: false,
        title: undefined,
        content: undefined,
        form: undefined,
      });
      const newColor = `#0247a1`;
      var metaThemeColor = document.querySelector("meta[name=theme-color]");
      metaThemeColor.setAttribute("content", newColor);
      setgTheme({
        ...gTheme,
        palette: {
          ...gTheme.palette,
          primary: {
            ...gTheme.palette.primary,
            main: newColor,
          },
        },
      });
      context.unload();
    };
  }, [appId]);
  useEffect(() => {
    setNavBar({ ...navBar, buttons: { ...navBar.buttons, ...appButtons } });
  }, [appButtons]);

  //UI

  if (!appContext) return <Loading />;
  return (
    <>
      <Hidden xsDown>
        <AppUIDesktop
          setCurrentPage={setCurrentPage}
          appContext={appContext}
          currentPage={currentPage}
        />
      </Hidden>
      <Hidden smUp>
        <AppUIMobile
          setCurrentPage={setCurrentPage}
          appContext={appContext}
          currentPage={currentPage}
        />
      </Hidden>
      {dialog !== undefined && (
        <Dialog
          onClose={() => {
            setDialog({ ...dialog, display: false });
          }}
          aria-labelledby="simple-dialog-title"
          open={dialog.display}
          maxWidth={dialog.size ? dialog.size : "sm"}
          fullWidth
        >
          {dialog.title && (
            <DialogTitle id="dialog-title">{dialog.title}</DialogTitle>
          )}
          {dialog.content && <DialogContent>{dialog.content}</DialogContent>}
          {dialog.form && (
            <Grid container style={{ width: "90%", marginLeft: 25 }}>
              {dialog.form.map((formItem) => {
                return (
                  <Grid
                    item
                    xs={formItem.xs ? formItem.xs : 12}
                    key={formItem.key}
                  >
                    {(!formItem.type ||
                      formItem.type === "text" ||
                      formItem.type === "number") && (
                      <TextInput
                        label={formItem.label}
                        type={
                          formItem.type
                            ? formItem.type === "number"
                              ? formItem.type
                              : "text"
                            : "text"
                        }
                        value={
                          dialogFormContent !== undefined
                            ? dialogFormContent[formItem.key]
                            : formItem.value
                        }
                        onChange={(value) => {
                          setDialogFormContent({
                            ...dialogFormContent,
                            [formItem.key]: formItem.type
                              ? formItem.type === "number"
                                ? parseInt(value)
                                : value
                              : value,
                          });
                        }}
                      />
                    )}
                    {formItem.type === "dropdown" && (
                      <Select
                        options={formItem.dropdownOptions}
                        label={formItem.label}
                        value={
                          dialogFormContent !== undefined
                            ? dialogFormContent[formItem.key]
                            : formItem.value
                        }
                        onChange={(value) => {
                          setDialogFormContent({
                            ...dialogFormContent,
                            [formItem.key]: value,
                          });
                        }}
                      />
                    )}
                  </Grid>
                );
              })}
            </Grid>
          )}
          {dialog.buttons && (
            <DialogActions>
              {dialog.buttons.map((button, index) => {
                return (
                  <Button
                    key={index}
                    onClick={() => {
                      setDialog({ ...dialog, display: false });
                      button.onClick(
                        dialogFormContent ? dialogFormContent : {}
                      );
                    }}
                  >
                    {button.label}
                  </Button>
                );
              })}
            </DialogActions>
          )}
        </Dialog>
      )}
    </>
  );
};

export default App;
