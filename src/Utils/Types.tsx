import { FC } from "react";
import { AnyARecord } from "dns";

export type ColumnWidth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type ServerResponse = { success: boolean; data?; reason?: string };

export interface UserType {
  _id: any;
  data: {
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
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
  typeArgs?: {
    type?: string;
    relationshipTo?: string;
    options?: { label: string; value: string }[];
  };
}

export interface ModelOverviewType {
  fields: string[];
  buttons: string[];
  actions: string[];
}
interface ModelApiType {
  active: boolean;
  endpoint?: string;
  authentication?: "none" | "user";
}

export interface ObjectType {
  _id: any;
  data: {};
}

export interface ModelType {
  key: string;
  name: string;
  name_plural: string;
  icon: string;
  app: string;
  primary: string;
  indexed: boolean;
  indexed_fields: string;
  fields: { [name: string]: ModelFieldType };
  overviews: [ModelOverviewType];
  preview?: { enabled: boolean; picture: string; fields: string[] };
  handlers: {};
  layouts: any;
  actions: any;
  api?: {
    read?: ModelApiType;
    create?: ModelApiType;
    modifyOwn?: ModelApiType;
    write?: ModelApiType;
    deleteOwn?: ModelApiType;
    delete?: ModelApiType;
  };
  permissions: {
    read: [string];
    create: [string];
    delete: [string];
    modifyOwn: [string];
    write: [string];
    deleteOwn: [string];
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
    core?: boolean;
    menu_type: string;
    pages?: {};
  };
  objectId: string;
}

export interface AppContextType {
  appId: string;
  app: AppType;
  isReady: Promise<unknown>;
  onNoAction: React.FC;
  appCode: any;
  user: UserType;
  appConfig?: {
    settings?: React.FC;
    actions?: {
      filter?: boolean;
      group?: boolean;
      mobile?: { displayAs?: "menu" | "bottom-navigation" | "tabs" };
    };
  };
  actions:
    | React.FC<{ context: AppContextType }>
    | [
        {
          label: string;
          key: string;
          component: FC;
          icon?: React.FC;
          group?: string;
        }
      ];
  UI: UIType;
  setButton: (
    buttonId,
    button: { label?: string; icon; function?; url?: string }
  ) => void;
  createModel: (newModel, then: (response: ServerResponse) => void) => void;
  getObjects: (
    type: string,
    filter: {},
    then: (response: ServerResponse) => void
  ) => AppRequestController;
  addObject: (type: string, object: {}, then: (response: any) => void) => void;
  deleteObjects: (type: string, filter: {}) => Promise<boolean | string>;
  updateModel: (type: string, newModel: {}, id) => Promise<boolean | string>;
  updateObject: (type: string, newObject: {}, id) => Promise<boolean | string>;
  setFieldDependencies: (
    context,
    dependencies,
    fieldId
  ) => Promise<boolean | string>;
  setDialog: (dialog: dialogType) => void;
  getModel: (
    modelId: string,
    then: (response: ServerResponse) => void
  ) => AppRequestController;

  getTypes: (
    filter: {},
    then: (response: {
      success: boolean;
      reason?: string;
      data?: [any];
    }) => void
  ) => AppRequestController;
  callBackendAction: (action, args) => void;
  archiveObject: (modelId: string, objectId: string) => Promise<string | null>;
}

export interface WidgetContextType {
  appId: string;
  app: AppType;
  isReady: Promise<unknown>;
  user: UserType;
  UI: UIType;
  getObjects: (
    type: string,
    filter: {},
    then: (response: any) => void
  ) => AppRequestController;
  addObject: (type: string, object: {}) => Promise<boolean | string>;
  deleteObjects: (type: string, filter: {}) => Promise<boolean | string>;
  updateModel: (type: string, newModel: {}, id) => Promise<boolean | string>;
  updateObject: (type: string, newObject: {}, id) => Promise<boolean | string>;
  setFieldDependencies: (
    context,
    dependencies,
    fieldId
  ) => Promise<boolean | string>;
  getTypes: (
    filter: {},
    then: (response: {
      success: boolean;
      reason?: string;
      data?: [any];
    }) => void
  ) => AppRequestController;
}

export interface dialogType {
  display: boolean;
  title?: string | JSX.Element;
  content?: any;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  onClose?: () => void;
  form?: {
    key: string;
    label: string;
    type?: "text" | "number" | "dropdown" | "boolean" | "custom";
    customInput?: React.FC<{
      value;
      onChange: (value) => void;
      context: AppContextType;
    }>;
    customInputProps?: {};
    value?: string;
    dropdownOptions?: { label: string; value: string }[];
    xs?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  }[];
  buttons?: { label: string | JSX.Element; onClick: (response) => void }[];
}
export interface AppRequestController {
  stop: () => void;
}

export interface TreeViewDataItem {
  key: string;
  label: string;
  icon: React.FC;
  subItems?: TreeViewDataItem[];
}
interface ListItem {
  label: string;
  id: string;
  subItems?: ListItem[];
}

export interface UIType {
  Loading: React.FC<{ label?: string }>;
  Margin: React.FC;
  Animations: { AnimationContainer: React.FC; AnimationItem: React.FC };
  Design: {
    Card: React.FC<{
      children;
      hoverable?: true;
      title?: string;
      style?;
      centerTitle?: true;
      titleDivider?: true;
      withBigMargin?: true | boolean;
      withSmallMargin?: true | boolean;
      sideMarginOnly?: true | boolean;
      className?: string;
    }>;
  };

  Layouts: {
    Object: {
      ObjectLayout: React.FC<{
        model?: ModelType;
        modelId?: string;
        layoutId: string;
        appId: string;
        objectId?: string;
        popup?: true;
        defaults?: { [key: string]: string };
      }>;
      BoardLayout: React.FC<{
        context: AppContextType;
        objects;
        model: ModelType;
        boardField: String;
        onItemClick?: (item) => void;
        customItem?: (listItem) => JSX.Element;
      }>;
    };
    Specialized: {
      LayoutDesigner: React.FC<{
        layout: LayoutDesignerItem[];
        onChange: (layout) => void;
        componentList: {};
      }>;
    };
    GridItemLayout: React.FC<{
      list?: {}[];
      remoteList?: string;
      title?: string;
      baseUrl?: string;
      dataMap: {
        title: string;
        description?: string;
        image?: string;
        url?: string;
        id: string;
      };
      onClick?: (item) => void;
      descriptionIsHtml?: true;
    }>;
    TreeView: React.FC<{
      items: TreeViewDataItem[];
      linkTo: string;
    }>;
    ListDetailLayout: React.FC<{
      mode?: "normal" | "tree";
      list?: ListItem[];
      treeList?: TreeViewDataItem[];
      baseUrl: string;
      customNavComponent?;
      DetailComponent: React.FC;
      detailComponentProps?: {};
      context: AppContextType;
      addFunction?: () => void;
      deleteFunction?: (id) => void;
      navWidth?: ColumnWidth;
      navFixedIcon?: JSX.Element;
      title?: string;
      isLoading?: true | boolean;
    }>;
    SortableList: React.FC<{
      listItems: [];
      listTextPath?: string;
      listSubTextPath?: string;
      baseUrl: string;
      linkToPath?: string;
      button?: true;
      ListIcon?: React.FC;
      listAction?: (id: string, object) => JSX.Element;
      onListItemClick?: (object) => void;
      onAdd?: () => void;
      customItem?: (listItem) => JSX.Element;
    }>;
  };
  Field: React.FC<{
    style?: {};
    modelId?: string;
    field?;
    fieldId: string;
    objectId?: string;
    directSave?: true;
    directSaveDelay?: number;
    object?;
    value?;
    mode?: "view" | "edit" | "free";
    onChange?: (value) => void;
  }>;
  FieldDisplay: React.FC<{
    modelField;
    objectField;
    props?;
  }>;

  Inputs: {
    RichText: React.FC<{
      placeholder?: string;
      label?: string;
      value?: string;
      mode?: "classic" | "balloon";
      onChange?: (value: string) => void;
    }>;
    TextInput: React.FC<{
      label?: string;
      value: string;
      type?: "text" | "number";
      onChange?: (value: string) => void;
      multiline?: boolean;
      style?: {};
      autoFocus?: boolean;
    }>;
    CheckmarkInput: React.FC<{
      label: string;
      value: boolean;
      onChange?: (value: string) => void;
    }>;
    SelectInput: React.FC<{
      label?: string;
      value?: string;
      options: { value: string; label: string }[];
      onChange?: (value) => void;
      style?;
    }>;
    Switch: React.FC<{
      label?: string;
      value?: string;
      onChange?: (value) => void;
      style?;
    }>;
  };
}

export interface LayoutType {
  layout: LayoutDesignerItem[];
  buttons: string[];
}

export interface LayoutDesignerItem {
  title?: string;
  type: string;
  field?: string;
  xs?: number;
  droppable?: boolean;
  label?: string;
}
