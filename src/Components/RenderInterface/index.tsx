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

const RenderInterface: React.FC<{
  context: AppContextType;
  interfaceId: string;
}> = ({ context, interfaceId }) => {
  // Vars
  const [interfaceObject, setInterfaceObject] = useState<InterfaceType>();
  const [varValues, setVarValues] = useState<{ [varKey: string]: {} }>({});
  const [prevVarValues, setPrevVarValues] = useState<{ [varKey: string]: {} }>(
    {}
  );
  const [currentInterface, setCurrentInterface] = useState<
    InterfaceInterfaces
  >();
  const [staticQueries, setStaticQueries] = useState<
    { vars: []; objectId; filter; varName: string }[]
  >();
  const [dynamicQueries, setDynamicQueries] = useState<
    { vars: []; objectId; filter; varName: string }[]
  >();

  // Lifecycle
  useEffect(() => {
    const interfaceRequest = context.getObjects(
      "interfaces",
      {},
      async (response) => {
        const newInterface: InterfaceType = response.data[0];
        setInterfaceObject(newInterface);
      }
    );

    return () => interfaceRequest.stop();
  }, [interfaceId]);
  useEffect(() => {
    const newVarValues = {};
    const newStaticQueries = [];
    const newDynamicQueries = [];

    if (interfaceObject) {
      map(interfaceObject.data.data.variables, (nVar, nKey) => {
        if (nVar.default) {
          newVarValues[nKey] = nVar.default;
        }
      });

      interfaceObject.data.data.logic.map((logicStep) => {
        switch (logicStep.type) {
          case "getObjects":
            const filter = JSON.parse(logicStep.args.filter);
            let isStatic = true;
            const queryVars = [];
            map(filter, (val, key) => {
              if (val.var) {
                isStatic = false;
                queryVars.push(val.var);
              }
            });

            if (isStatic) {
              newStaticQueries.push({
                varName: logicStep.args.assignedVar,
                objectId:
                  interfaceObject.data.data.variables[
                    logicStep.args.assignedVar
                  ].model,
                filter,
              });
            } else {
              newDynamicQueries.push({
                varName: logicStep.args.assignedVar,
                vars: queryVars,
                objectId:
                  interfaceObject.data.data.variables[
                    logicStep.args.assignedVar
                  ].model,
                filter,
              });
            }

            break;
          case "renderInterface":
            setCurrentInterface(
              interfaceObject.data.data.interfaces[logicStep.args.layoutId]
            );

            break;
          default:
            console.log(`Unknown logic step type ${logicStep.type}`);

            break;
        }
      });

      setVarValues(newVarValues);
      setStaticQueries(newStaticQueries);
      setDynamicQueries(newDynamicQueries);
    }
  }, [interfaceObject]);

  // Static queries (only change when the query changes)
  useEffect(() => {
    const requests = [];
    (staticQueries || []).map((sq) => {
      requests.push(
        context.getObjects(sq.objectId, sq.filter, (response) => {
          setVarValues({
            ...varValues,
            [sq.varName]: response.data,
          });
        })
      );
    });

    return () => {
      requests.map((r) => r.stop());
    };
  }, [staticQueries]);

  // Dynamic queries (changes when the variable changes)
  useEffect(() => {
    const requests = [];
    (dynamicQueries || []).map((query) => {
      let hasChanged = false;
      query.vars.map((qv) => {
        if (varValues[qv] !== prevVarValues[qv]) {
          hasChanged = true;
        }
      });

      if (hasChanged) {
        const filter = { ...query.filter };
        map(filter, (v, k) => {
          if (v.var) {
            filter[k] = varValues[v.var];
          }
        });

        requests.push(
          context.getObjects(query.objectId, filter, (response) => {
            setVarValues({ ...varValues, [query.varName]: response.data });
          })
        );
        setPrevVarValues({ ...varValues });
      }
    });

    return () => {
      requests.map((r) => r.stop());
    };
  }, [dynamicQueries, varValues, prevVarValues]);

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
        <RenderInterfaceGridContainer>
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
        <RenderInterfaceGridItem>
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
