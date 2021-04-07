import { FC } from "react";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { CardProps } from "../Components/Design/Card";
import { IconType } from "react-icons";
import { GridSize } from "@material-ui/core";

export type ServerResponse = { success: boolean; data?; reason?: string };

export interface OptionType {
  label: string;
  value: string;
}

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

export interface ConditionsType {
  logic: string;
  conditions: ConditionType[];
}

export interface ConditionType {
  field: string;
  operator: "equals";
  value;
}

export interface ModelFieldType {
  name: string;
  required: boolean;
  unique: boolean;
  validations: [string];
  transformations: [string];
  conditions: ConditionsType;
  default?: string;
  type?: string;
  typeArgs?: {
    type?: string;
    relationshipTo?: string;
    display?: "multi-dropdown";
    options?: { label: string; key: string }[];
    key?: string;
    readonly?: boolean;
    asBanner?: boolean;
    numberType?: "regular" | "currency";
  };
}

export interface ModelOverviewType {
  fields: string[];
  buttons: { global?: string[]; single?: string[]; multiple?: string[] };
}
interface ModelApiType {
  active: boolean;
  endpoint?: string;
  authentication?: "none" | "user";
}

export interface ObjectType {
  _id: any;
  data: any;
  objectId?: string;
}

export interface TaskType {
  _id: any;
  data: {
    name: string;
    type: string;
    description: string;
    when: string;
    action: string;
    task: string;
    done: boolean;
    arguments: {};
    progress: number;
    state: string;
  };
}

export interface ModelListType {
  name: string;
  filter: { key: string; operator: "equals" | "not_equals"; value: any }[];
  visibleFor?: string[];
}

export interface ModelRuleType {
  name: string;
  rule: string;
  message: string;
  checkedOn:
    | "All"
    | "Insert"
    | "Update"
    | "Delete"
    | "InsertAndUpdate"
    | "InsertAndDelete"
    | "UpdateAndDelete"
    | "Never";
}
export interface ModelActionType {
  label: string;
  mode: "free" | "single" | "multiple";
  type: "create" | "interface";
  interface?: string;
  layout?: string;
  passContextTo?: string;
  icon: string;
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
  lists?: { [key: string]: ModelListType };
  rules?: { [key: string]: ModelRuleType };
  preview?: {
    enabled: boolean;
    ModelListTypepicture: string;
    fields: string[];
    picture?: string;
  };
  handlers: {};
  layouts: any;
  actions: {
    [name: string]: ModelActionType;
  };
  extensions?: { [key: string]: {} };
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
  _id;
  data: {
    id: string;
    name: string;
    color: ColorType;
    icon: string;
    core?: boolean;
    menu_type: string;
    pages?: {};
    type?: "collection" | "code";
    collection_data?: {
      installScript: [];
      data: {};
      actions: {
        key: string;
        label: string;
        icon: string;
        page: { type: "model"; model?: string };
      }[];
    };
  };
  objectId: string;
}

export interface AppContextType {
  sessionVariables: {};
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
  setImage(image: any);
  setColor(color: any);
  showSnackbar: (
    text: string,
    properties?: {
      duration?: number;
      action?: (close: () => void) => JSX.Element;
    }
  ) => void;
  actions: {
    label: string;
    key: string;
    component: FC;
    icon?: React.FC;
    group?: string;
    subItems: any;
  }[];
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
  performAction: (
    id,
    args,
    context: AppContextType,
    title?: string
  ) => Promise<string>;
  addObject: (type: string, object: {}, then: (response: any) => void) => void;
  addObjects: (
    type: string,
    objects: {}[],
    then: (response: any) => void
  ) => void;
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
  getDataFromExternalApi: (url: string) => Promise<{}>;
  getModels: (
    filter: {},
    then: (response: {
      success: boolean;
      reason?: string;
      data?: [any];
    }) => void
  ) => AppRequestController;
  callBackendAction: (action, args) => void;
  archiveObject: (modelId: string, objectId: string) => Promise<string | null>;
  requestServerAction: (action: string, args: {}) => Promise<any>;
  getAppSettings: (key: string) => Promise<{}>;
  setAppSettings: (key: string, value: any) => Promise<void>;
  getSystemSettings: (key: string) => Promise<any | string>;
  setSystemSettings: (key: string, value: any) => Promise<void>;
}

export interface WidgetContextType {
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
  getAppSettings: (key: string) => Promise<{}>;
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

export interface dialogType {
  display: boolean;
  title?: string | JSX.Element;
  content?: any;
  background?: string;
  style?: CSSProperties;
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
    value?: string | any;
    dropdownOptions?: { label: string; value: string }[];
    dropdownMultiple?: boolean;
    xs?: GridSize;
    onlyDisplayWhen?: {};
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

export interface ValueListItemType {
  label: string;
  value: string;
  args?: { [key: string]: any };
}

export interface ListDetailItemType {
  label: string;
  id: string;
  subtitle?: string;
  icon?: IconType | string;
  subItems?: ListDetailItemType[];
}

export interface UIType {
  Icon: React.FC<{ icon: string }>;
  Loading: React.FC<{ label?: string }>;
  Margin: React.FC;
  PageLayouts: {
    CenteredBlock: React.FC<{
      children;
      title?: string;
      width?:
        | boolean
        | "auto"
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8
        | 9
        | 10
        | 11
        | 12;
      centered?: true;
    }>;
  };
  Animations: {
    AnimationContainer: React.FC<{ style?: CSSProperties }>;
    AnimationItem: React.FC<{ style?: CSSProperties }>;
    Animation: React.FC<{ style?: CSSProperties }>;
  };
  Object: {
    Overview: React.FC<{
      context: AppContextType;
      modelId: string;
      overviewId?: string;
      baseUrl: string;
    }>;
    Detail: React.FC<{
      model?: ModelType;
      modelId?: string;
      layoutId: string;
      context: AppContextType;
      objectId?: string;
      object?: ObjectType;
      popup?: true;
      defaults?: { [key: string]: string | any };
      baseUrl?: string;
      onObjectDisappears?: (history) => void;
      mode?: "view" | "edit";
      onSuccess?: () => void;

      provideCustomFields?: { [key: string]: React.FC<CustomFieldType> };
      provideLayoutElements?: {
        [key: string]: React.FC<CustomLayoutElementType>;
      };
      hideFields?: string[];
      style?: CSSProperties;
    }>;
  };
  Design: {
    Card: React.FC<CardProps>;
  };

  Layouts: {
    BoardLayout: React.FC<{
      context: AppContextType;
      objects;
      model: ModelType;
      boardField: String;
      onItemClick?: (item) => void;
      customItem?: (listItem) => JSX.Element;
    }>;
    Specialized: {
      LayoutDesigner: React.FC<{
        layout: LayoutDesignerItem[];
        onChange: (layout) => void;
        componentList: {};
      }>;
      ConditionDesigner: React.FC<{
        model: ModelType;
        value: ConditionType[];
        onChange: (value: ConditionType[]) => void;
      }>;
    };
    GridItemLayout: React.FC<{
      data: ObjectType[];
      cols?: GridSize;
      title?: string;
      text?: string;
      link?: string;
      baseUrl?: string;
      image?: string;
    }>;
    TreeView: React.FC<{
      items: TreeViewDataItem[];
      linkTo: string;
    }>;
    ListDetailLayout: React.FC<{
      mode?: "normal" | "tree";
      list?: ListDetailItemType[];
      treeList?: TreeViewDataItem[];
      baseUrl: string;
      CustomNavComponent?: React.FC<any>;
      DetailComponent: React.FC;
      detailComponentProps?: {};
      navComponentProps?: {};
      context: AppContextType;
      addFunction?: () => void;
      addTitle?: string;
      deleteFunction?: (id) => void;
      navWidth?: GridSize;
      navFixedIcon?: JSX.Element;
      title?: string;
      isLoading?: true | boolean;
      style?: CSSProperties;
      imageField?: string;
      objects?: ObjectType[];
      navDynamicIcon?: (item) => JSX.Element;
      itemSecondary?: (item) => JSX.Element;
      customNavItems?: [JSX.Element];
      footerComponent?: JSX.Element;
      description?: string;
      emptyMessage?: string;
    }>;
    SortableList: React.FC<{
      items: {
        label: string;
        id: string;
      }[];
      onChange: (
        items: {
          label: string;
          id: string;
        }[]
      ) => void;
      renderItem?: (item, index: number) => JSX.Element;
    }>;
  };
  Field: React.FC<{
    style?: {};
    modelId?: string;
    model?: ModelType;
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
    Checkboxes: React.FC<{
      label?: string;
      value?: string;
      onChange?: (value: string) => void;
      readOnly?: boolean;
      type?: "radio" | "checkbox";
      options: { value; label: string }[];
    }>;
    Select: React.FC<{
      label?: string;
      options: { value; label: string }[];
      value?;
      isLoading?: boolean;
      onChange?: (value) => void;
      multiple?: true | boolean;
      style?: CSSProperties;
    }>;
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
      onChange?: (value: string | number) => void;
      multiline?: boolean;
      style?: {};
      autoFocus?: boolean;
      noLabel?: boolean;
      onEnter?: (value: string) => void;
      onEscape?: (value: string) => void;
      onKeyPress?: (value: string) => void;
    }>;
    CheckmarkInput: React.FC<{
      label?: string;
      value: boolean;
      onChange?: (
        value: boolean,
        event: React.ChangeEvent<HTMLInputElement>
      ) => void;
    }>;
    Color: React.FC<{
      placeholder?: string;
      label?: string;
      value?:
        | { r: number; g: number; b: number }
        | string
        | { h: number; s: number; l: number };
      onChange?: (value: { r: number; g: number; b: number }) => void;
    }>;
    Switch: React.FC<{
      label?: string;
      value?: boolean;
      onChange?: (value) => void;
      style?;
    }>;
    FindObject: React.FC<{
      label: string;
      modelId: string;
      value?;
      isLoading?: boolean;
      onChange?: (value, args?) => void;
      multiple?: true | boolean;
      style?: CSSProperties;
      display?: "select" | "radio" | "checkbox";
      context: AppContextType;
      primary: string;
    }>;
  };
}

export interface LayoutType {
  layout: LayoutDesignerItem[];
  buttons: {
    key: string;
    args: { type?: "extension" | "action" | "server_action" };
  }[];
  factsBar: string[];
}

export interface LayoutDesignerItem {
  title?: string;
  type: string;
  field?: string;
  xs?: number;
  droppable?: boolean;
  label?: string;
}

export interface SelectOptionType {
  label: string;
  value: string;
}

export interface WidgetType {
  name: string;
  key: string;
  app: string;
  description: string;
  icon: any;
  id: string;
  grid?: {
    defaultX?: number;
    defaultY?: number;
    minX?: number;
    minY?: number;
    maxX?: number;
    maxY?: number;
  };
}

export interface CustomFieldType {
  mode: "view" | "edit";
  value;
  context: AppContextType;
  onChange?: (newValue) => void;
  fullObject: ObjectType;
}

export interface CustomLayoutElementType {
  mode: "view" | "edit";
  context: AppContextType;
  layoutItem;
  object: ObjectType;
  fullObject: ObjectType;
}

export interface PersonType {
  _id: string;
  data: {
    first_name: string;
    last_name: string;
    full_name: string;
    birthday: Date;
    picture?: string;
    email?: string;
    phone?: string;
  };
}
export interface CustomFormInputType {
  onChange: (value: string) => void;
  context: AppContextType;
  value;
  label: string;
  [x: string]: any;
}

export interface SystemTaskType extends ObjectType {
  data: {
    name: string;
    type: string;
    description: string;
    when: "asap";
    action: string;
    done: boolean;
    arguments: {};
    progress: number;
    state: string;
  };
}

export interface InterfaceLogicStepType {
  label: string;
  key: string;
  type: "renderInterface" | "getObject" | "getObjects";
  args?: { assignedVar?: string; filter?: string; layoutId?: string };
  results: { label: string; step?: string }[];
}

export interface InterfaceInterfaces {
  label: string;
  content: LayoutDesignerItem[];
}

export interface InterfaceActionType {
  label: string;
  actions: { type: "set_variables" | "insert_object"; vars?: {} }[];
}

export interface InterfaceType extends ObjectType {
  data: {
    name: string;
    key: string;
    data: {
      logic: {
        steps: { [stepKey: string]: InterfaceLogicStepType };
        trigger?: string;
      };
      actions: { [key: string]: InterfaceActionType };
      variables: {
        [key: string]: {
          type;
          label: string;
          model?: string;
          input_var?: boolean;
        };
      };
      interfaces: InterfaceInterfaces;
    };
  };
}

export interface NotificationType extends ObjectType {
  data: {
    user: string;
    date: string;
    title: string;
    content: string;
    target: string;
    read?: boolean;
  };
}
