import Server from "../../../Utils/Server";
import uniqid from "uniqid";
import { AppType, ServerResponse } from "../../../Utils/Types";
import Loading from "./AppUI/Loading";
import { AnimationContainer, AnimationItem } from "./AppUI/Animations";
import * as Forms from "./AppUI/Forms";
import ListDetailLayout from "./AppUI/ListDetailLayout";
import TreeView from "./AppUI/TreeView";
import AppUiField from "./AppUI/Field";
import SortableList from "../../UI/SortableList";
import InputSwitch from "../../Inputs/Switch";
import ObjectLayout from "./AppUI/ObjectLayout";
import BoardLayout from "../../Layouts/ObjectLayouts/Boards";
import Margin from "./AppUI/Margin";
import FieldDisplay from "../../Object/FieldDisplay";
import GridItemLayout from "../Apps/AppUI/Layouts/GridItemLayout";
import LayoutDesigner from "../../../Components/LayoutDesigner";
import Card from "../../Design/Card";
import InputRichText from "../../Inputs/RichText";
import ConditionDesigner from "../../ConditionDesigner";
import { baseUrl } from "../../../Utils/Utils";

export class AppContext {
  appId: string;
  app: AppType;
  isReady: Promise<unknown>;
  appCode: any;
  actions: [{ label: string; key: string }];
  UI: any;
  dataListeners: [{ requestId: string; unlistenAction: string }];
  setDialog: any;
  appButtons;
  setAppButtons;
  appConfig;
  user;
  onNoAction;
  setSessionVariable: (key, value) => {};
  setSnackbar: (title, properties?) => void;

  constructor(
    appId,
    setDialog,
    appButtons,
    setAppButtons,
    user,
    setSessionVariable,
    setSnackbar
  ) {
    this.appId = appId;
    this.setDialog = setDialog;
    this.appButtons = appButtons;
    this.setAppButtons = setAppButtons;
    this.user = user;
    this.setSessionVariable = setSessionVariable;
    this.setSnackbar = setSnackbar;
    this.UI = {
      Loading,
      Margin: Margin,
      Design: {
        Card,
      },
      Animations: { AnimationContainer, AnimationItem },
      Inputs: { ...Forms, Switch: InputSwitch, RichText: InputRichText },
      Field: AppUiField,
      FieldDisplay,
      Layouts: {
        ListDetailLayout,
        TreeView,
        GridItemLayout,
        SortableList,
        Object: {
          ObjectLayout,
          BoardLayout,
        },
        Specialized: {
          LayoutDesigner,
          ConditionDesigner,
        },
      },
    };
    this.isReady = new Promise((resolve, reject) => {
      const requestId = uniqid();
      this.dataListeners = [
        {
          requestId,
          unlistenAction: "unlistenForObjects",
        },
      ];
      Server.emit("listenForObjects", {
        requestId,
        type: "app",
        filter: { "data.id": appId },
      });
      Server.on(`receive-${requestId}`, (response) => {
        if (response.success) {
          this.app = response.data[0];
          import(
            `../../../Apps-${this.app.data.core ? "Core" : "User"}/${
              this.appId
            }/index.tsx`
          ).then((app) => {
            const AppCode = app.default;
            this.appCode = new AppCode(this);
            this.appConfig = this.appCode.appConfig;
            this.onNoAction = this.appCode.onNoAction;
            this.appCode.getActions().then((actions) => {
              this.actions = actions;
              resolve();
            });
          });
        } else {
          console.log(response);
        }
      });
    });
  }

  // Close active listeners for app
  unload = () => {
    this.setAppButtons({});
    this.dataListeners.map((listener) => {
      Server.emit(listener.unlistenAction, {
        requestId: listener.requestId,
      });
    });
  };

  updateAppButtons = (appButtons) => {
    this.appButtons = appButtons;
  };

  // (Un)register a global button
  setButton = (buttonId, button) => {
    this.setAppButtons({
      ...this.appButtons,
      [`${this.appId}-${buttonId}`]: button,
    });
  };

  setImage = (img) => {
    this.setSessionVariable("image", img ? baseUrl + img : undefined);
  };

  createModel = (newModel, then: (response: ServerResponse) => void) => {
    const requestId = uniqid();
    Server.emit("appCreatesModel", {
      newModel,
      requestId,
      appId: this.appId,
    });
    Server.on(`receive-${requestId}`, (response) => {
      console.log(response);
    });
  };

  // Returns a realtime connection listening for a model
  getModel = (modelId: string, then: (response: ServerResponse) => void) => {
    const requestId = uniqid();
    this.dataListeners.push({
      requestId,
      unlistenAction: "appUnlistensForModel",
    });
    Server.emit("appListensForModel", {
      requestId,
      appId: this.appId,
      modelId,
    });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.reason === "no-read-permission-app") {
        this.setDialog({
          display: true,
          title: `${this.app.data.name} wants to read '${modelId}'`,
          content: "Do you wish to allow this?",
          size: "xs",
          buttons: [
            {
              label: "No",
              onClick: () => {
                then({
                  success: false,
                  reason: "permission-denied-by-user",
                });
              },
            },
            {
              label: "Yes",
              onClick: () => {
                const allowPermissionRequestId = uniqid();
                Server.emit("allowAppAccess", {
                  requestId: allowPermissionRequestId,
                  appId: this.appId,
                  objectType: modelId,
                  permissionType: "read",
                });
                Server.on(`receive-${allowPermissionRequestId}`, (response) => {
                  // Retry
                  this.getModel(modelId, then);
                });
              },
            },
          ],
        });
      } else {
        then(response);
      }
    });
    // Return the controller element with a stop() function
    return new AppDataController("appUnlistensForObjectTypes", requestId);
  };

  // Todo: legacy function: delete this
  getTypes = (filter, then) => {
    if (typeof filter === "object") {
      const requestId = uniqid();
      this.dataListeners.push({
        requestId,
        unlistenAction: "appUnlistensForObjectTypes",
      });
      Server.emit("appListensForObjectTypes", {
        requestId,
        appId: this.appId,
        filter,
      });
      Server.on(`receive-${requestId}`, then);
      // Return the controller element with a stop() function
      return new AppDataController("appUnlistensForObjectTypes", requestId);
    } else {
      then({ success: false, reason: "Filter should be object" });
    }
  };

  getObjects = (type, filter, then) => {
    if (typeof filter === "object") {
      const requestId = uniqid();
      this.dataListeners.push({
        requestId,
        unlistenAction: "appUnlistensForObjects",
      });
      Server.emit("appListensForObjects", {
        requestId,
        appId: this.appId,
        type,
        filter,
      });
      Server.on(`receive-${requestId}`, (response) => {
        if (response.success) {
          then(response);
        } else {
          console.log("Query failed: ", response.reason);
          if (response.reason === "no-permission-app") {
            this.setDialog({
              display: true,
              title: `${this.app.data.name} wants to read '${type}'`,
              content: "Do you wish to allow this?",
              size: "xs",
              buttons: [
                {
                  label: "No",
                  onClick: () => {
                    then({
                      success: false,
                      reason: "permission-denied-by-user",
                    });
                  },
                },
                {
                  label: "Yes",
                  onClick: () => {
                    const allowPermissionRequestId = uniqid();
                    Server.emit("allowAppAccess", {
                      requestId: allowPermissionRequestId,
                      appId: this.appId,
                      objectType: type,
                      permissionType: "read",
                    });
                    Server.on(
                      `receive-${allowPermissionRequestId}`,
                      (response) => {
                        // Retry
                        this.getObjects(type, filter, then);
                      }
                    );
                  },
                },
              ],
            });
          }
        }
      });
      // Return the controller element with a stop() function
      return new AppDataController("appUnlistensForObjects", requestId);
    } else {
      then({ success: false, reason: "filter-should-be-object" });
    }
  };

  addObject = (type, object, then) => {
    const requestId = uniqid();
    Server.emit("appInsertsObject", {
      requestId,
      type,
      object,
      appId: this.appId,
    });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        then(response);
      } else {
        if (response.feedback) {
          then(response);
        } else {
          if (response.reason === "no-create-permission-app") {
            // Ask user for permission
            this.setDialog({
              display: true,
              title: `${this.app.data.name} is trying to create in '${type}'`,
              content: "Do you wish to allow this?",
              size: "xs",
              buttons: [
                {
                  label: "No",
                  onClick: () => {
                    then({
                      success: false,
                      reason: "permission-denied-by-user",
                    });
                  },
                },
                {
                  label: "Yes",
                  onClick: () => {
                    const allowPermissionRequestId = uniqid();
                    Server.emit("allowAppAccess", {
                      requestId: allowPermissionRequestId,
                      appId: this.appId,
                      objectType: type,
                      permissionType: "create",
                    });
                    Server.on(
                      `receive-${allowPermissionRequestId}`,
                      (response) => {
                        // Retry
                        this.addObject(type, object, then);
                      }
                    );
                  },
                },
              ],
            });
          } else {
            then(response);
          }
        }
      }
    });
  };

  addObjects = (type, objects, then) => {
    const requestId = uniqid();
    Server.emit("appInsertsObjects", {
      requestId,
      type,
      objects,
      appId: this.appId,
    });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        then(response);
      } else {
        if (response.feedback) {
          then(response);
        } else {
          if (response.reason === "no-create-permission-app") {
            // Ask user for permission
            this.setDialog({
              display: true,
              title: `${this.app.data.name} is trying to create in '${type}'`,
              content: "Do you wish to allow this?",
              size: "xs",
              buttons: [
                {
                  label: "No",
                  onClick: () => {
                    then({
                      success: false,
                      reason: "permission-denied-by-user",
                    });
                  },
                },
                {
                  label: "Yes",
                  onClick: () => {
                    const allowPermissionRequestId = uniqid();
                    Server.emit("allowAppAccess", {
                      requestId: allowPermissionRequestId,
                      appId: this.appId,
                      objectType: type,
                      permissionType: "create",
                    });
                    Server.on(
                      `receive-${allowPermissionRequestId}`,
                      (response) => {
                        // Retry
                        this.addObjects(type, objects, then);
                      }
                    );
                  },
                },
              ],
            });
          } else {
            then(response);
          }
        }
      }
    });
  };

  showSnackbar = (title, properties?) => {
    this.setSnackbar(title, properties);
  };

  deleteObjects = (type, filter) => {
    return new Promise((resolve, reject) => {
      const requestId = uniqid();
      Server.emit("appDeletesObject", {
        requestId,
        type,
        filter,
        appId: this.appId,
      });
      Server.on(`receive-${requestId}`, (response) => {
        if (response.success) {
          resolve();
        } else {
          console.log("Query failed: ", response);
          if (response.reason === "no-delete-permission-app") {
            this.setDialog({
              display: true,
              title: `${this.app.data.name} wants to delete from '${type}'`,
              content: "Do you wish to allow this?",
              size: "xs",
              buttons: [
                {
                  label: "No",
                  onClick: () => {
                    reject({
                      success: false,
                      reason: "permission-denied-by-user",
                    });
                  },
                },
                {
                  label: "Yes",
                  onClick: () => {
                    const allowPermissionRequestId = uniqid();
                    Server.emit("allowAppAccess", {
                      requestId: allowPermissionRequestId,
                      appId: this.appId,
                      objectType: type,
                      permissionType: "delete",
                    });
                    Server.on(
                      `receive-${allowPermissionRequestId}`,
                      (response) => {
                        // Retry
                        this.deleteObjects(type, filter);
                      }
                    );
                  },
                },
              ],
            });
          }
          reject(response.reason);
        }
      });
    });
  };

  updateModel = (modelType, newData, modelId) => {
    return new Promise((resolve, reject) => {
      const requestId = uniqid();
      Server.emit("appUpdatesModel", {
        newModel: newData,
        requestId,
        type: modelType,
        id: modelId,
        appId: this.appId,
      });

      Server.on(`receive-${requestId}`, (response) => {
        if (response.success) {
          resolve();
        } else {
          reject(response.reason);
        }
      });
    });
  };

  updateObject = (type, newObject, id) => {
    return new Promise((resolve, reject) => {
      const requestId = uniqid();
      Server.emit("appUpdatesObject", {
        requestId,
        type,
        id,
        newObject,
        appId: this.appId,
      });
      Server.on(`receive-${requestId}`, (response) => {
        if (response.success) {
          resolve();
        } else {
          if (response.reason) {
            if (response.reason === "no-update-permission-app") {
              // Ask user for permission
              this.setDialog({
                display: true,
                title: `${this.app.data.name} is trying to update in '${type}'`,
                content: "Do you wish to allow this?",
                size: "xs",
                buttons: [
                  {
                    label: "No",
                    onClick: () => {
                      reject({
                        success: false,
                        reason: "permission-denied-by-user",
                      });
                    },
                  },
                  {
                    label: "Yes",
                    onClick: () => {
                      const allowPermissionRequestId = uniqid();
                      Server.emit("allowAppAccess", {
                        requestId: allowPermissionRequestId,
                        appId: this.appId,
                        objectType: type,
                        permissionType: "update",
                      });
                      Server.on(
                        `receive-${allowPermissionRequestId}`,
                        (response) => {
                          // Retry
                          this.updateObject(type, newObject, id);
                        }
                      );
                    },
                  },
                ],
              });
            } else {
              reject(response.reason);
            }
          } else {
            reject(response.feedback);
          }
        }
      });
    });
  };

  // Only for core apps
  setFieldDependencies = (context, dependencies, fieldId) => {
    return new Promise((resolve, reject) => {
      if (this.appId === "object-manager") {
        const requestId = uniqid();
        Server.emit("setFormulaDependencies", {
          requestId,
          context,
          dependencies,
          fieldId,
          appId: this.appId,
        });
        Server.on(`receive-${requestId}`, (response) => {
          if (response.success) {
            resolve();
          } else {
            reject(response.reason);
          }
        });
      } else {
        reject("restricted-to-core-app");
      }
    });
  };

  callBackendAction = (action, args) => {
    const requestId = uniqid();
    Server.emit("performBackendAction", {
      action,
      args,
      requestId,
      appId: this.appId,
    });
  };

  archiveObject = (modelId, objectId) => {
    return new Promise((resolve, reject) => {
      const requestId = uniqid();
      Server.emit("appArchivesObject", {
        modelId,
        objectId,
        appId: this.appId,
        requestId,
      });

      Server.on(`receive-${requestId}`, (response) => {
        if (response.success) {
          resolve();
        } else {
          if (response.reason === "no-archive-permission-app") {
            this.setDialog({
              display: true,
              title: `${this.app.data.name} wants to archive '${modelId}'`,
              content: "Do you wish to allow this?",
              size: "xs",
              buttons: [
                {
                  label: "No",
                  onClick: () => {
                    reject("permission-denied-by-user");
                  },
                },
                {
                  label: "Yes",
                  onClick: () => {
                    const allowPermissionRequestId = uniqid();
                    Server.emit("allowAppAccess", {
                      requestId: allowPermissionRequestId,
                      appId: this.appId,
                      objectType: modelId,
                      permissionType: "archive",
                    });
                    Server.on(
                      `receive-${allowPermissionRequestId}`,
                      (response) => {
                        // Retry
                        this.archiveObject(modelId, objectId);
                      }
                    );
                  },
                },
              ],
            });
          }
        }
      });
    });
  };
}

// Pass this back to the app to allow cancelling listeners
// -> If this is not called by the app, all listeners will be cancelled on app unload
class AppDataController {
  cancelCommand: string;
  requestId: string;
  constructor(cancelCommand, requestId) {
    this.cancelCommand = cancelCommand;
    this.requestId = requestId;
  }

  stop = () => {
    Server.emit(this.cancelCommand, { requestId: this.requestId });
  };
}
