import { ObjectType } from "../../Utils/Types";

export interface ProcessTrigger {
  type: "cron";
  args?: {};
  name: string;
}

export interface ProcessStep {
  condition: ProcessStepCondition;
  actions: ProcessStepAction[];
}

export interface ProcessStepAction {
  name: string;
  type: "InsertObject" | "DeleteObjects" | "wait";
  args: {};
}

export interface ProcessStepCondition {
  name: string;
  conditions: { type: "always" }[];
  actionIfTrue: "executeSteps" | "executeStepsAndNextStep" | undefined;
  actionIfFalse: "nextStep" | "sendNotification" | undefined;
}

export interface AutomationType extends ObjectType {
  data: {
    type: "Automation" | "Process";
    name: string;
    description: string;
    data: { triggers?: ProcessTrigger[]; steps?: ProcessStep[] };
  };
}

export interface ActionLogicStepType {
  label: string;
  type:
    | "insertObject"
    | "wait"
    | "deleteObjects"
    | "waitUntil"
    | "case"
    | "loop";
  time?: number;
  args?: { cases?: [] };
  var?: string;
}

export interface ActionVarType {
  type: "text" | "boolean" | "object" | "objects" | "options" | "number";
  name: string;
  label?: string;
  setting_value: any;
  setting?;
  model?: string;
  description?;
  default?: boolean;
  options?;
}

export interface ActionType extends ObjectType {
  data: {
    name: string;
    key: string;
    icon?: string;
    description: string;
    active: boolean;
    data: {
      vars: {
        [varId: string]: ActionVarType;
      };
      logic: ActionLogicStepType[];
      triggers: {
        manual: { varSingle?: string };
        time: { label: string; cron: string; when?: string }[];
        data: { label: string; model?: string; fields?: string[] }[];
      };
    };
  };
}
