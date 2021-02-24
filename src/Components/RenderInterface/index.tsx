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

const RenderInterface: React.FC<{
  context: AppContextType;
  interfaceId: string;
}> = ({ context, interfaceId }) => {
  // Vars
  const [interfaceObject, setInterfaceObject] = useState<InterfaceType>();
  const [varValues, setVarValues] = useState<{ [varKey: string]: {} }>({});
  const [currentInterface, setCurrentInterface] = useState<
    InterfaceInterfaces
  >();

  // Lifecycle
  useEffect(() => {
    const interfaceRequest = context.getObjects(
      "interfaces",
      {},
      async (response) => {
        const newInterface: InterfaceType = response.data[0];

        // Execute interface logic
        const newVarValues = {};
        //@ts-ignore
        await newInterface.data.data.logic.reduce(async (prev, logicStep) => {
          await prev;
          switch (logicStep.type) {
            case "getObjects":
              const filter = JSON.parse(logicStep.args.filter);
              const modelId =
                newInterface.data.data.variables[logicStep.args.assignedVar]
                  .model;
              const fetchDataPromise = new Promise((resolve) => {
                context.getObjects(modelId, filter, (response) => {
                  resolve(response.data);
                });
              });
              newVarValues[logicStep.args.assignedVar] = await fetchDataPromise;
              setVarValues(newVarValues);
              break;
            case "renderInterface":
              setCurrentInterface(
                newInterface.data.data.interfaces[logicStep.args.layoutId]
              );
              break;
            default:
              console.log(`Unknown logic step type ${logicStep.type}`);

              break;
          }

          return logicStep;
        }, newInterface.data.data.logic[0]);

        setInterfaceObject(newInterface);
      }
    );

    return () => interfaceRequest.stop();
  }, [interfaceId]);

  // UI
  if (!interfaceObject) return <context.UI.Loading />;
  if (!currentInterface) return <>No interface set</>;
  return (
    <div style={{ marginBottom: 82 }}>
      {map(currentInterface.content, (contentItem, contentKey) => (
        <LayoutItem
          key={contentKey}
          layoutItem={contentItem}
          vars={varValues}
          setVars={setVarValues}
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
}

const LayoutItem: React.FC<{
  layoutItem: LayoutItemType;
  vars: { [varKey: string]: {} };
  setVars;
}> = ({ layoutItem, vars, setVars }) => {
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
        <div>{layoutItem.text}</div>
      ) : layoutItem.type === "grid_container" ? (
        <RenderInterfaceGridContainer>
          {layoutItem.items.map((child) => (
            <LayoutItem
              key={child.key}
              layoutItem={child}
              vars={vars}
              setVars={setVars}
            />
          ))}
        </RenderInterfaceGridContainer>
      ) : layoutItem.type === "grid_item" ? (
        <RenderInterfaceGridItem>
          {layoutItem.items.map((child) => (
            <LayoutItem
              key={child.key}
              layoutItem={child}
              vars={vars}
              setVars={setVars}
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
            />
          ))}
        </RenderInterfaceAnimationSingle>
      ) : layoutItem.type === "list" ? (
        <RenderInterfaceList
          title={newLayoutItem.title}
          list={(vars[layoutItem.varName] as []) || []}
          primary={layoutItem.primary}
          secondary={layoutItem.secondary}
        />
      ) : layoutItem.type === "toggle" ? (
        <RenderInterfaceToggle
          value={(vars[layoutItem.varName] as boolean) || false}
          labelWhenTrue={layoutItem.labelWhenTrue}
          labelWhenFalse={layoutItem.labelWhenFalse}
          onChange={(newVal) =>
            setVars({ ...vars, [layoutItem.varName]: newVal })
          }
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
