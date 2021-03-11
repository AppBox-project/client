import React, { useEffect, useState } from "react";
import {
  AppContextType,
  InterfaceType,
  ModelActionType,
  ModelType,
  ValueListItemType,
} from "../../../../../../Utils/Types";
import { Fab } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { FaSave } from "react-icons/fa";
import { map, filter } from "lodash";

const AppActionManageObjectActionsDetail: React.FC<{
  match: { params: { detailId } };
  context: AppContextType;
  model: ModelType;
}> = ({
  match: {
    params: { detailId },
  },
  context,
  model,
}) => {
  // Vars
  const [action, setAction] = useState<ModelActionType>();
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [interfaceList, setInterfaceList] = useState<ValueListItemType[]>();
  const [selectedInterface, setSelectedInterface] = useState<InterfaceType>();
  const [selectedInterfaceVarList, setSelectedInterfaceVarList] = useState<
    ValueListItemType[]
  >();

  // Lifecycle
  useEffect(() => {
    setAction(model.actions[detailId]);
  }, [detailId]);
  useEffect(() => {
    let request;
    if (!interfaceList && action?.type === "interface") {
      request = context.getObjects("interfaces", {}, (response) => {
        const nl: ValueListItemType[] = [];
        response.data.map((i: InterfaceType) =>
          nl.push({ label: i.data.name, value: i._id })
        );

        setInterfaceList(nl);
      });
    }
    return () => request?.stop();
  }, [interfaceList, action?.type]);
  useEffect(() => {
    let request;
    if (action?.interface) {
      if (selectedInterface?._id !== action?.interface) {
        request = context.getObjects(
          "interfaces",
          { _id: action.interface },
          (response) => {
            const ni: InterfaceType = response.data[0];
            setSelectedInterface(ni);
            const nl: ValueListItemType[] = [];
            map(ni.data.data.variables, (intVar, key) => {
              nl.push({ label: intVar.label, value: key, args: intVar });
            });
            setSelectedInterfaceVarList(nl);
          }
        );
      }
    }

    return request?.stop();
  }, [action?.interface]);

  // UI
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <context.UI.Design.Card withBigMargin title="Action">
          {!action ? (
            <>
              <Skeleton variant="text" />
            </>
          ) : (
            <>
              <context.UI.Inputs.TextInput
                label="Label"
                value={action?.label}
                onChange={(value) => {
                  setAction({ ...action, label: value });
                  setHasChanged(true);
                }}
              />
              <context.UI.Inputs.TextInput
                label="Icon"
                value={action?.icon}
                onChange={(icon) => {
                  setAction({ ...action, icon });
                  setHasChanged(true);
                }}
              />

              <context.UI.Inputs.Select
                label="Mode"
                options={[
                  { value: "free", label: "Free (requires no inputs)" },
                  {
                    value: "single",
                    label: "Single (requires single object input)",
                  },
                  {
                    value: "multiple",
                    label: "Multiple (requires multiple objects input)",
                  },
                ]}
                value={action.mode}
                onChange={(value) => {
                  setAction({ ...action, mode: value });
                  setHasChanged(true);
                }}
              />
              {action?.mode && (
                <context.UI.Inputs.Select
                  label="Type"
                  options={[
                    ...(action.mode === "free"
                      ? [
                          {
                            value: "create",
                            label: "Create new object",
                          },
                          { value: "interface", label: "Show interface" },
                        ]
                      : [{ value: "interface", label: "Show interface" }]),
                  ]}
                  value={action.type}
                  onChange={(value) => {
                    setAction({ ...action, type: value });
                    setHasChanged(true);
                  }}
                />
              )}
              {action?.type === "create" && (
                <context.UI.Inputs.TextInput
                  label="Lay-out"
                  value={action.layout}
                  onChange={(value) => {
                    setAction({ ...action, layout: value });
                    setHasChanged(true);
                  }}
                />
              )}
            </>
          )}
          {action?.type === "interface" && (
            <>
              <context.UI.Inputs.Select
                label="Interface to render"
                value={action?.interface}
                options={interfaceList}
                onChange={(value) => {
                  setAction({ ...action, interface: value });
                  setHasChanged(true);
                }}
              />
              {action?.mode === "single" && (
                <context.UI.Inputs.Select
                  label="Variable to pass current object to"
                  options={filter(
                    selectedInterfaceVarList,
                    (o) => o.args.type === "object" && o.args.input_var
                  )}
                  value={action.passContextTo}
                  onChange={(value) => {
                    setAction({ ...action, passContextTo: value });
                    setHasChanged(true);
                  }}
                />
              )}
              {action?.mode === "multiple" && (
                <context.UI.Inputs.Select
                  label="Variable to pass selected objects to"
                  options={filter(
                    selectedInterfaceVarList,
                    (o) => o.args.type === "objects" && o.args.input_var
                  )}
                  value={action.passContextTo}
                  onChange={(value) => {
                    setAction({ ...action, passContextTo: value });
                    setHasChanged(true);
                  }}
                />
              )}
            </>
          )}
        </context.UI.Design.Card>
      </context.UI.Animations.AnimationItem>
      <context.UI.Animations.AnimationItem>
        {hasChanged && (
          <Fab
            style={{ position: "fixed", bottom: 15, right: 15 }}
            color="primary"
            onClick={() => {
              context.updateModel(
                model.key,
                {
                  ...model,
                  actions: { ...model.actions, [detailId]: action },
                },
                model._id
              );
            }}
          >
            <FaSave />
          </Fab>
        )}
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppActionManageObjectActionsDetail;
