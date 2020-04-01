import Server from "../../../Utils/Server";
import uniqid from "uniqid";
import { AppType } from "../../../Utils/Types";
import Loading from "./AppUI/Loading";
import { AnimationContainer, AnimationItem } from "./AppUI/Animations";
import * as Forms from "./AppUI/Forms";
import AppActionManageObjectTabFieldsEditor from "../../../Apps/object-manager/Actions/ManageObject/Tabs/Fields/FieldEditor";

export class AppContext {
  appId: string;
  app: AppType;
  isReady: Promise<unknown>;
  appCode: any;
  actions: [{ label: string; key: string }];
  UI: any;
  dataListeners: [{ requestId: string; unlistenAction: string }];
  setDialog: any;

  constructor(appId, setDialog) {
    this.appId = appId;
    this.setDialog = setDialog;
    this.UI = { Loading, AnimationContainer, AnimationItem, Forms };
    this.isReady = new Promise((resolve, reject) => {
      const requestId = uniqid();
      this.dataListeners = [
        {
          requestId,
          unlistenAction: "unlistenForObjects"
        }
      ];
      Server.emit("listenForObjects", {
        requestId,
        type: "app",
        filter: { "data.id": appId }
      });
      Server.on(`receive-${requestId}`, response => {
        if (response.success) {
          this.app = response.data[0];
          import(`../../../Apps/${this.appId}/index.tsx`).then(app => {
            const AppCode = app.default;
            this.appCode = new AppCode(this);
            this.appCode.getActions().then(actions => {
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
    this.dataListeners.map(listener => {
      Server.emit(listener.unlistenAction, { requestId: listener.requestId });
    });
  };

  getTypes = (filter, then) => {
    if (typeof filter === "object") {
      const requestId = uniqid();
      this.dataListeners.push({
        requestId,
        unlistenAction: "appUnlistensForObjectTypes"
      });
      Server.emit("appListensForObjectTypes", {
        requestId,
        appId: this.appId,
        filter
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
        unlistenAction: "appUnlistensForObjects"
      });
      Server.emit("appListensForObjects", {
        requestId,
        appId: this.appId,
        type,
        filter
      });
      Server.on(`receive-${requestId}`, response => {
        then(response);
      });
      // Return the controller element with a stop() function
      return new AppDataController("appUnlistensForObjects", requestId);
    } else {
      then({ success: false, reason: "filter-should-be-object" });
    }
  };

  addObject = (type, object) => {
    return new Promise((resolve, reject) => {
      const requestId = uniqid();
      Server.emit("appInsertsObject", {
        requestId,
        type,
        object,
        appId: this.appId
      });
      Server.on(`receive-${requestId}`, response => {
        if (response.success) {
          resolve();
        } else {
          if (response.feedback) {
            reject(response.feedback);
          } else {
            reject(response.reason);
          }
        }
      });
    });
  };

  deleteObjects = (type, filter) => {
    return new Promise((resolve, reject) => {
      const requestId = uniqid();
      Server.emit("appDeletesObject", {
        requestId,
        type,
        filter,
        appId: this.appId
      });
      Server.on(`receive-${requestId}`, response => {
        if (response.success) {
          resolve();
        } else {
          reject(response.reason);
        }
      });
    });
  };

  updateModel = (type, newModel, id) => {
    return new Promise((resolve, reject) => {
      const requestId = uniqid();
      Server.emit("appUpdatesModel", {
        requestId,
        type,
        id,
        newModel,
        appId: this.appId
      });
      Server.on(`receive-${requestId}`, response => {
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
        appId: this.appId
      });
      Server.on(`receive-${requestId}`, response => {
        if (response.success) {
          resolve();
        } else {
          if (response.reason) {
            reject(response.reason);
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
          appId: this.appId
        });
        Server.on(`receive-${requestId}`, response => {
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
