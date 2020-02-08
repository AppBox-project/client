import Server from "../../../Utils/Server";
import uniqid from "uniqid";
import { AppType } from "../../../Utils/Types";

export class AppContext {
  appId: string;
  app: AppType;
  isReady: Promise<unknown>;
  appCode: any;
  actions: [{ label: string; key: string }];

  constructor(appId) {
    this.appId = appId;
    this.isReady = new Promise((resolve, reject) => {
      const requestId = uniqid();
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

  getData = (type, filter) => {
    return new Promise((resolve, reject) => {
      console.log(typeof filter);
    });
  };

  getTypes = filter => {
    return new Promise((resolve, reject) => {
      if (typeof filter === "object") {
        const requestId = uniqid();
        Server.emit("appListensForObjectTypes", {
          requestId,
          appId: this.appId,
          filter
        });
        Server.on(`receive-${requestId}`, response => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(response.reason);
          }
        });
      } else {
        reject("Filter should be object");
      }
    });
  };
}
