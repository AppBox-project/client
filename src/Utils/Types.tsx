import { FC } from "react";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

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
  type?: string;
  typeArgs?: {
    type?: string;
    relationshipTo?: string;
    options?: { label: string; key: string }[];
    key?: string;
    readonly?: boolean;
    asBanner?: boolean;
    numberType?: "regular" | "currency";
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
  data: any;
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
  requestServerAction: (action: string, args) => Promise<any>;
  formatString: (text: string, data: {}) => string;
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
    value?: string;
    dropdownOptions?: { label: string; value: string }[];
    xs?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
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
}

export interface ListItemType {
  label: string;
  id: string;
  subItems?: ListItemType[];
}

export interface UIType {
  Loading: React.FC<{ label?: string }>;
  Margin: React.FC;
  Animations: { AnimationContainer: React.FC; AnimationItem: React.FC };
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
      defaults?: { [key: string]: string };
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
      titleInPrimaryColor?: true | boolean;
      className?: string;
      disablePadding?: boolean;
      buttons?: {
        label: string;
        icon?;
        compact?: boolean;
        onClick: () => void;
      }[];
    }>;
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
      list?: ListItemType[];
      treeList?: TreeViewDataItem[];
      baseUrl: string;
      customNavComponent?;
      DetailComponent: React.FC;
      detailComponentProps?: {};
      context: AppContextType;
      addFunction?: () => void;
      addTitle?: string;
      deleteFunction?: (id) => void;
      navWidth?: ColumnWidth;
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
    Select: React.FC<{
      label: string;
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
      onChange?: (value: string) => void;
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
}

export interface CustomLayoutElementType {
  mode: "view" | "edit";
  context: AppContextType;
  layoutItem;
  object: ObjectType;
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
