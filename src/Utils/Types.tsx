import { FC } from "react";

export interface UserType {
  data: {
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  objectId: string;
}

export interface TypeType {
  key: string;
  name: string;
  name_plural: string;
  primary: string;
  fields: any;
  overviews: any;
  layouts: any;
  buttons: any;
  permissions: {
    read: [string];
    create: [string];
    delete: [string];
  };
}

export interface ColorType {
  r: number;
  g: number;
  b: number;
}

export interface AppType {
  data: {
    id: string;
    name: string;
    color: ColorType;
    icon: string;
    menu_type: string;
    pages?: {};
  };
  objectId: string;
}
export interface AppContextType {
  appId: string;
  app: AppType;
  isReady: Promise<unknown>;
  appCode: any;
  actions: [{ label: string; key: string; component: FC }];
  UI: any;
  getObjects: (
    type: string,
    filter: {},
    then: (response: any) => void
  ) => Promise<{} | string>;
  addObject: (type: string, objects: {}) => Promise<boolean | string>;
}
