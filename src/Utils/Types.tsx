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

export interface ModelFieldType {
  name: string;
  required: boolean;
  unique: boolean;
  validations: [string];
  transformations: [string];
  type?: string;
}

export interface ModelOverviewType {
  fields: [string];
  buttons: [string];
  actions: [string];
}

export interface TypeType {
  key: string;
  name: string;
  name_plural: string;
  primary: string;
  fields: [ModelFieldType];
  overviews: [ModelOverviewType];
  layouts: any;
  buttons: any;
  permissions: {
    read: [string];
    create: [string];
    delete: [string];
  };
  _id: any;
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
  addObject: (type: string, object: {}) => Promise<boolean | string>;
  deleteObjects: (type: string, filter: {}) => Promise<boolean | string>;
  updateModel: (type: string, newModel: {}, id) => Promise<boolean | string>;
  setDialog: any;
  getTypes: (
    filter: {},
    then: (response: {
      success: boolean;
      reason?: string;
      data?: [any];
    }) => void
  ) => void;
}

export interface UIType {
  Loading: React.FC;
  AnimationContainer: React.FC;
  AnimationItem: React.FC;
  Forms: {
    TextInput: React.FC<{
      label: string;
      value: string;
      onChange?: (value: String) => void;
    }>;
    CheckmarkInput: React.FC<{
      label: string;
      value: boolean;
      onChange?: (value: String) => void;
    }>;
  };
}
