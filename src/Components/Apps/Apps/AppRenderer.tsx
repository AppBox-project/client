import React, { useGlobal, useEffect, useState } from "reactn";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Hidden,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import Loading from "../../Loading";
import { AppContextType, dialogType } from "../../../Utils/Types";
import { AppContext } from "./AppContext";
import { TextInput } from "./AppUI/Forms";
import AppUIDesktop from "./AppUI/DesktopLayout";
import AppUIMobile from "./AppUI/MobileLayout";
import Select from "./AppUI/Forms/Select";
import { map, find } from "lodash";

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
  const [currentPage, setCurrentPage] = useState<any>();
  const [dialog, setDialog] = useState<dialogType>();
  const [dialogFormContent, setDialogFormContent] = useState<{}>({});
  const [gTheme, setgTheme] = useGlobal<any>("theme");
  const [gApp, setgApp] = useGlobal<any>("app");
  const [gUser] = useGlobal<any>("user");
  const [actions, setActions] = useGlobal<any>("actions");
  const [appButtons, setAppButtons] = useState<any>({});

  //Lifecycle
  useEffect(() => {
    setCurrentApp(appId);
    const context = new AppContext(
      appId,
      setDialog,
      appButtons,
      setAppButtons,
      gUser
    );
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
      setActions({});

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
    setActions({ ...actions, ...appButtons });
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
            if (dialog.onClose) dialog.onClose();
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
                let display = formItem.onlyDisplayWhen ? false : true;
                if (!display) {
                  map(formItem.onlyDisplayWhen, (v, k) => {
                    const depItem = find(dialog.form, (o) => o.key === k);

                    if ((dialogFormContent[k] || depItem.value) === v)
                      display = true;
                  });
                }
                return display ? (
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
                          dialogFormContent[formItem.key] || formItem.value
                        }
                        onChange={(value) => {
                          setDialogFormContent({
                            ...dialogFormContent,
                            [formItem.key]: value,
                          });
                        }}
                      />
                    )}

                    {formItem.type === "boolean" && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            onChange={(e) => {
                              setDialogFormContent({
                                ...dialogFormContent,
                                [formItem.key]: e.target.checked,
                              });
                            }}
                            checked={
                              dialogFormContent !== undefined
                                ? dialogFormContent[formItem.key]
                                : formItem.value || false
                            }
                          />
                        }
                        label={formItem.label}
                      />
                    )}
                    {formItem.type === "custom" && (
                      <formItem.customInput
                        {...(formItem.customInputProps || {})}
                        context={appContext}
                        value={
                          dialogFormContent
                            ? dialogFormContent[formItem.key] || formItem.value
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
                ) : (
                  <></>
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
                      const defaultDialogContent = {};
                      (dialog.form || []).map((formItem) => {
                        defaultDialogContent[formItem.key] = formItem.value;
                      });

                      setDialog({
                        ...dialog,
                        display: false,
                      });
                      button.onClick({
                        ...defaultDialogContent,
                        ...dialogFormContent,
                      });
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
