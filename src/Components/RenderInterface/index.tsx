import React, { useState } from "react";
import { useEffect } from "reactn";
import {
  AppContextType,
  InterfaceInterfaces,
  InterfaceType,
} from "../../Utils/Types";
import { map } from "lodash";
import RenderInterfaceGridContainer from "./InterfaceComponents/GridContainer";
import RenderInterfaceGridItem from "./InterfaceComponents/GridItem";
import RenderInterfaceCard from "./InterfaceComponents/Card";
import RenderInterfaceAnimationSingle from "./InterfaceComponents/AnimationSingle";
import RenderInterfaceList from "./InterfaceComponents/List";
import RenderInterfaceToggle from "./InterfaceComponents/Toggle";
import Loading from "../Loading";
import formula from "../../Utils/Functions/ClientFormula";
import RenderInterfaceOptions from "./InterfaceComponents/Options";
import RenderInterfaceAnimationContainer from "./InterfaceComponents/AnimationContainer";
import RenderInterfaceAnimationItem from "./InterfaceComponents/AnimationItem";
import RenderInterfaceButton from "./InterfaceComponents/Button";
import RenderInterfaceInput from "./InterfaceComponents/Input";
import { GridSpacing } from "@material-ui/core";

const RenderInterface: React.FC<{
  context: AppContextType;
  interfaceId: string;
}> = ({ context, interfaceId }) => {
  // Vars
  const [interfaceObject, setInterfaceObject] = useState<InterfaceType>();
  const [varValues, setVarValues] = useState<{ [varKey: string]: {} }>({});
  const [prevVarValues, setPrevVarValues] = useState<{ [varKey: string]: {} }>({
    initial: true,
  });
  const [currentInterface, setCurrentInterface] = useState<
    InterfaceInterfaces
  >();
  const [error, setError] = useState<string>();

  // Lifecycle
  useEffect(() => {
    const interfaceRequest = context.getObjects(
      "interfaces",
      { _id: interfaceId },
      (response) => {
        setInterfaceObject(response.data[0]);
      }
    );

    return () => interfaceRequest.stop();
  }, [interfaceId]);
  // When the interface changes
  useEffect(() => {
    const newVarValues = { ...varValues };
    const requests = [];

    if (
      interfaceObject &&
      JSON.stringify(varValues) !== JSON.stringify(prevVarValues)
    ) {
      map(interfaceObject.data.data.variables, (nVar, nKey) => {
        if (nVar.default && !newVarValues[nKey]) {
          newVarValues[nKey] = nVar.default;
        }
      });
      if (interfaceObject.data.data.logic.trigger) {
        executeTrigger(
          context,
          interfaceObject,
          interfaceObject.data.data.logic.trigger,
          setError,
          newVarValues,
          (newValue, key) => {
            newVarValues[key] = newValue;

            setVarValues(newVarValues);
            setPrevVarValues(newVarValues);
          },
          (r) => {
            requests.push(r);
          },
          (currentInterface) => {
            setCurrentInterface(currentInterface);
            setError(undefined);
          }
        );
      } else {
        setError("This interface has no initial trigger!");
      }
      return () => requests.map((r) => r && r.stop());
    }
  }, [interfaceObject, varValues, prevVarValues]);

  // UI
  if (error)
    return (
      <context.UI.Animations.Animation>
        <context.UI.Design.Card title="Error" withBigMargin>
          {error}
        </context.UI.Design.Card>
      </context.UI.Animations.Animation>
    );

  if (!interfaceObject) return <context.UI.Loading />;
  if (!currentInterface) {
    setError("No interface has been set, so none can be rendered");
    return;
  }
  return (
    <div style={{ marginBottom: 82 }}>
      {map(currentInterface.content, (contentItem, contentKey) => (
        <LayoutItem
          key={contentKey}
          layoutItem={contentItem}
          vars={varValues}
          setVars={setVarValues}
          interfaceObject={interfaceObject}
        />
      ))}
    </div>
  );
};

export default RenderInterface;

interface LayoutItemType {
  type: "text";
  text?: string;
  items?: LayoutItemType[];
  key: string;
  title?: string;
  withBigMargin?: true;
  varName?: string;
  primary?: string;
  secondary?: string;
  labelWhenTrue?: string;
  labelWhenFalse?: string;
  linkTo?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  variant?: string;
  fullWidth?: boolean;
  label?: string;
  colored?: boolean;
  action?: string;
  spacing?: GridSpacing;
}

const LayoutItem: React.FC<{
  layoutItem: LayoutItemType;
  vars: { [varKey: string]: {} };
  setVars;
  interfaceObject: InterfaceType;
}> = ({ layoutItem, vars, setVars, interfaceObject }) => {
  // Vars
  const [newLayoutItem, setNewLayoutItem] = useState<LayoutItemType>();

  // Lifecycle
  useEffect(() => {
    parseObjectFormulas(layoutItem, vars).then((result: LayoutItemType) => {
      setNewLayoutItem(result);
    });
  }, [layoutItem, vars]);

  // UI
  if (!newLayoutItem) return <Loading />;

  return (
    <>
      {layoutItem.type === "text" ? (
        <div>{newLayoutItem.text}</div>
      ) : layoutItem.type === "grid_container" ? (
        <RenderInterfaceGridContainer spacing={layoutItem.spacing}>
          {layoutItem.items.map((child) => (
            <LayoutItem
              key={child.key}
              layoutItem={child}
              vars={vars}
              setVars={setVars}
              interfaceObject={interfaceObject}
            />
          ))}
        </RenderInterfaceGridContainer>
      ) : layoutItem.type === "grid_item" ? (
        <RenderInterfaceGridItem {...layoutItem}>
          {layoutItem.items.map((child) => (
            <LayoutItem
              key={child.key}
              layoutItem={child}
              vars={vars}
              setVars={setVars}
              interfaceObject={interfaceObject}
            />
          ))}
        </RenderInterfaceGridItem>
      ) : layoutItem.type === "card" ? (
        <RenderInterfaceCard
          withBigMargin={layoutItem.withBigMargin}
          title={layoutItem.title}
        >
          {layoutItem.items.map((child) => (
            <LayoutItem
              key={child.key}
              layoutItem={child}
              vars={vars}
              setVars={setVars}
              interfaceObject={interfaceObject}
            />
          ))}
        </RenderInterfaceCard>
      ) : layoutItem.type === "animation_single" ? (
        <RenderInterfaceAnimationSingle>
          {layoutItem.items.map((child) => (
            <LayoutItem
              key={child.key}
              layoutItem={child}
              vars={vars}
              setVars={setVars}
              interfaceObject={interfaceObject}
            />
          ))}
        </RenderInterfaceAnimationSingle>
      ) : layoutItem.type === "animation_group" ? (
        <RenderInterfaceAnimationContainer>
          {layoutItem.items.map((child) => (
            <LayoutItem
              key={child.key}
              layoutItem={child}
              vars={vars}
              setVars={setVars}
              interfaceObject={interfaceObject}
            />
          ))}
        </RenderInterfaceAnimationContainer>
      ) : layoutItem.type === "animation_item" ? (
        <RenderInterfaceAnimationItem>
          {layoutItem.items.map((child) => (
            <LayoutItem
              key={child.key}
              layoutItem={child}
              vars={vars}
              setVars={setVars}
              interfaceObject={interfaceObject}
            />
          ))}
        </RenderInterfaceAnimationItem>
      ) : layoutItem.type === "list" ? (
        <RenderInterfaceList
          title={newLayoutItem.title}
          list={(vars[newLayoutItem.varName] as []) || []}
          primary={newLayoutItem.primary}
          secondary={newLayoutItem.secondary}
          linkTo={layoutItem.linkTo}
        />
      ) : layoutItem.type === "toggle" ? (
        <RenderInterfaceToggle
          value={(vars[newLayoutItem.varName] as boolean) || false}
          labelWhenTrue={newLayoutItem.labelWhenTrue}
          labelWhenFalse={newLayoutItem.labelWhenFalse}
          onChange={(newVal) =>
            setVars({ ...vars, [newLayoutItem.varName]: newVal })
          }
        />
      ) : layoutItem.type === "options" ? (
        <RenderInterfaceOptions
          value={vars[newLayoutItem.varName] as string}
          onChange={(newVal) =>
            setVars({ ...vars, [newLayoutItem.varName]: newVal })
          }
          varMeta={interfaceObject.data.data.variables[newLayoutItem.varName]}
        />
      ) : layoutItem.type === "button" ? (
        <RenderInterfaceButton
          interfaceObject={interfaceObject}
          fullWidth={newLayoutItem.fullWidth}
          variant={newLayoutItem.variant}
          label={newLayoutItem.label}
          colored={newLayoutItem.colored}
          actionId={newLayoutItem.action}
          vars={vars}
          setVars={setVars}
        />
      ) : layoutItem.type === "input" ? (
        <RenderInterfaceInput
          layoutItem={newLayoutItem}
          vars={vars}
          setVars={setVars}
        />
      ) : (
        `Unknown layoutItem ${layoutItem.type}`
      )}
    </>
  );
};

const parseObjectFormulas = (obj, data) =>
  new Promise<{}>(async (resolve) => {
    const newObject = { ...obj };
    //@ts-ignore
    await Object.keys(newObject).reduce(async (prev, currKey) => {
      await prev;
      const i = newObject[currKey];
      if (typeof i === "string") {
        if (i.match(/{{.*}}/gm)) {
          newObject[currKey] = await formula(i, { ...data });
        }
      }

      return currKey;
    }, Object.keys(newObject)[0]);
    resolve(newObject);
  });

const executeTrigger = async (
  context: AppContextType,
  interfaceObject: InterfaceType,
  stepId: string,
  setError,
  varValues,
  setVarValues: (value, key) => void,
  addToRequests: (request) => void,
  setCurrentInterface
) =>
  new Promise(async (resolve, reject) => {
    const step = interfaceObject.data.data.logic.steps[stepId];
    if (!step) {
      setError(`Error executing step ${stepId}`);
      return;
    }

    switch (step.type) {
      case "getObjects":
        const filter: {} = JSON.parse(step.args.filter);
        map(filter, (v, k) => {
          if (v.var) {
            filter[k] = varValues[v.var];
          }
        });

        addToRequests(
          context.getObjects(
            interfaceObject.data.data.variables[step.args.assignedVar].model,
            filter,
            (response) => {
              console.log(
                "Todo: minimize amount of queries. Response received: ",
                response
              );

              const newVarValues = varValues;
              newVarValues[step.args.assignedVar] = response.data;
              setVarValues(response.data, step.args.assignedVar);

              executeTrigger(
                context,
                interfaceObject,
                step.results[0].step,
                setError,
                newVarValues,
                setVarValues,
                addToRequests,
                setCurrentInterface
              );
            }
          )
        );

        break;
      case "renderInterface":
        setCurrentInterface(
          interfaceObject.data.data.interfaces[step.args.layoutId]
        );
        break;
      default:
        setError(`Failed to execute step ${stepId}: unknown type ${step.type}`);
        break;
    }
  });
