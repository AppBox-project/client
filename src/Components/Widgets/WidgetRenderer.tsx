import React, { useGlobal, useEffect, useState } from "reactn";
import { WidgetContext } from "./Widgetcontext";
import uniqid from "uniqid";
import Server from "../../Utils/Server";
import Loading from "../Loading";
import { WidgetContextType, dialogType } from "../../Utils/Types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Button,
} from "@material-ui/core";
import { TextInput } from "../Apps/Apps/AppUI/Forms";
import Select from "../Apps/Apps/AppUI/Forms/Select";

const Widget: React.FC<{ settings }> = ({ settings }) => {
  // Vars
  const [widgetInfo, setWidgetInfo] = useState<any>();
  const [widgetContext, setWidgetContext] = useState<WidgetContextType>();
  const [user] = useGlobal<any>("user");
  const [Widget, setWidget] = useState<any>();
  const [dialog, setDialog] = useState<dialogType>();
  const [dialogFormContent, setDialogFormContent] = useState<any>();

  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjects", {
      requestId,
      type: "widgets",
      filter: { _id: settings.type },
    });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        setWidgetInfo(response.data[0]);
      } else {
        console.log(response);
      }
    });

    return () => {
      Server.emit("unlistenForObjects", { requestId });
    };
  }, []);

  // UI
  if (!widgetInfo) return <Loading />;
  let WidgetComponent;
  if (widgetInfo.data.system) {
    WidgetComponent = require(`./${widgetInfo.data.key}/index`).default;
  } else {
    console.log(
      `../../${widgetInfo.data["app_core"] ? "Apps-Core" : "Apps-User"}/${
        widgetInfo.data["app_id"]
      }/Widget/${widgetInfo.data.key}/index`
    );

    WidgetComponent = require(`../../${
      widgetInfo.data["app_core"] ? "Apps-Core" : "Apps-User"
    }/${widgetInfo.data["app_id"]}/Widgets/${widgetInfo.data.key}/index`)
      .default;
  }
  const context = new WidgetContext(
    widgetInfo.system ? "system" : widgetInfo["app_id"],
    setDialog,
    user
  );
  return (
    <>
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
      <WidgetComponent context={context} />
    </>
  );
};

export default Widget;
