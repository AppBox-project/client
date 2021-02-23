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
    <>
      {map(currentInterface.content, (contentItem, contentKey) => (
        <LayoutItem
          key={contentKey}
          layoutItem={contentItem}
          vars={varValues}
        />
      ))}
    </>
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
}

const LayoutItem: React.FC<{
  layoutItem: LayoutItemType;
  vars: { [varKey: string]: {} };
}> = ({ layoutItem, vars }) => {
  return (
    <>
      {layoutItem.type === "text" ? (
        <div>{layoutItem.text}</div>
      ) : layoutItem.type === "grid_container" ? (
        <RenderInterfaceGridContainer>
          {layoutItem.items.map((child) => (
            <LayoutItem key={child.key} layoutItem={child} vars={vars} />
          ))}
        </RenderInterfaceGridContainer>
      ) : layoutItem.type === "grid_item" ? (
        <RenderInterfaceGridItem>
          {layoutItem.items.map((child) => (
            <LayoutItem key={child.key} layoutItem={child} vars={vars} />
          ))}
        </RenderInterfaceGridItem>
      ) : layoutItem.type === "card" ? (
        <RenderInterfaceCard
          withBigMargin={layoutItem.withBigMargin}
          title={layoutItem.title}
        >
          {layoutItem.items.map((child) => (
            <LayoutItem key={child.key} layoutItem={child} vars={vars} />
          ))}
        </RenderInterfaceCard>
      ) : layoutItem.type === "animation_single" ? (
        <RenderInterfaceAnimationSingle>
          {layoutItem.items.map((child) => (
            <LayoutItem key={child.key} layoutItem={child} vars={vars} />
          ))}
        </RenderInterfaceAnimationSingle>
      ) : layoutItem.type === "list" ? (
        <RenderInterfaceList
          title={layoutItem.title}
          list={(vars[layoutItem.varName] as []) || []}
          primary={layoutItem.primary}
          secondary={layoutItem.secondary}
        />
      ) : (
        `Unknown layoutItem ${layoutItem.type}`
      )}
    </>
  );
};
