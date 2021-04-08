import React, { useState, useEffect, useRef } from "reactn";
import { useGlobal } from "reactn";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import uniqid from "uniqid";
import Server from "../../Utils/Server";
import {
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
  List,
} from "@material-ui/core";
import { useHistory } from "react-router";
import { ModelType } from "../../Utils/Types";
import find from "lodash/find";
import FaIcon from "../Icons";

var debounce = require("debounce-promise");

const Search: React.FC<{ style?; setSearchExpanded? }> = ({
  style,
  setSearchExpanded,
}) => {
  // Vars
  const [isLoading, setIsLoading] = useState<any>(false);
  const [models, setModels] = useState<any>({});
  const history = useHistory();
  const [apps, setApps] = useState<any>([]);
  const [gTheme] = useGlobal<any>("theme");
  const [app] = useGlobal<any>("app");

  const debouncedLoadOptions = useRef(
    debounce((query) => {
      return new Promise(async (resolve, reject) => {
        if (query) {
          const requestId = uniqid();
          Server.emit("search", { query, requestId });
          Server.on(`receive-${requestId}`, (response) => {
            setIsLoading(false);
            resolve(response);
          });
        } else {
          reject();
        }
      });
    }, 250)
  ).current;

  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjectTypes", { requestId, filter: {} });
    Server.on(`receive-${requestId}`, (response) => {
      const m = {};
      response.map((r) => {
        m[r.key] = r;
      });
      setModels(m);
    });

    const appRequestId = uniqid();
    Server.emit("listenForObjects", {
      requestId: appRequestId,
      type: "apps",
      filter: {},
    });
    Server.on(`receive-${appRequestId}`, (response) => {
      if (response.success) {
        setApps(response.data);
      } else {
        console.log(response);
      }
    });
  }, []);

  // UI
  return (
    <div style={style}>
      <AsyncSelect
        value={null}
        onChange={(chosen, e) => {
          if (setSearchExpanded) setSearchExpanded(false);
          history.push(`/o/${chosen?.obj?.id}`);
        }}
        components={{
          MenuList: (props) => {
            return (
              <components.MenuList {...props}>
                <List style={{ zIndex: 25, position: "relative" }}>
                  {props.children}
                </List>
              </components.MenuList>
            );
          },
          Option: (props, { innerProps, innerRef, selectOption }) => {
            const model: ModelType = models[props.data.obj.type];
            const compatibleApps = {
              explorer: "/explorer/{model.key}/{object._id}",
              ...model.handlers,
            };
            const defaultHandler = compatibleApps[model.app]
              ? model.app
              : "explorer";
            const handlerApp = find(apps, (o) => o.data.id === defaultHandler);

            return (
              <components.Option {...props}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      style={{
                        backgroundColor: `rgba(${handlerApp.data.color.r},${handlerApp.data.color.g},${handlerApp.data.color.b},${handlerApp.data.color.a})`,
                      }}
                    >
                      <FaIcon
                        icon={model.icon}
                        style={{
                          ...(gTheme.palette.type === "dark"
                            ? { color: "white" }
                            : {}),
                        }}
                      />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    ref={innerRef}
                    {...innerProps}
                    primary={props.data.label}
                    secondary={model.name}
                  />
                </ListItem>
              </components.Option>
            );
          },
        }}
        isLoading={isLoading}
        loadOptions={async (inputValue) => {
          if (inputValue) setIsLoading(true);
          return await debouncedLoadOptions(inputValue);
        }}
        isClearable
        placeholder="Search everything..."
        noOptionsMessage={(msg) =>
          msg.inputValue
            ? `${msg.inputValue} not found.`
            : "Start typing to search.."
        }
        styles={{
          container: (styles) => ({
            ...styles,
            zIndex: 500,
            position: "relative",
          }),
          control: (styles) => ({
            ...styles,
            backgroundColor: "rgba(255,255,255,0.1)",
            border: 0,
            color: "white",
            borderRadius: 5,
            zIndex: 500,
            transition: "all 0.3s",
            boxShadow: "none",
            "&:active": {
              backgroundColor: "rgba(255,255,255,0.2)",
            },
          }),
          menu: (styles) => ({
            ...styles,
            ...(gTheme.palette.type === "dark"
              ? { backgroundColor: "#212121" }
              : {}),
          }),
          option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
              ...styles,
              zIndex: 500,
              ...(gTheme.palette.type === "light" ? { color: "#212121" } : {}),
              backgroundColor: isSelected
                ? `rgba(${app?.data?.color?.r || 2},${
                    app?.data?.color?.g || 71
                  },${app?.data?.color?.b || 161},1)`
                : isFocused &&
                  `rgba(${app?.data?.color?.r || 2},${
                    app?.data?.color?.g || 71
                  },${app?.data?.color?.b || 161},0.4)`,
            };
          },
          input: (styles) => {
            return { ...styles, color: "white" };
          },
          clearIndicator: (styles) => {
            return { ...styles, color: "white" };
          },
          dropdownIndicator: (styles) => {
            return { ...styles, color: "white" };
          },
          loadingIndicator: (styles) => {
            return { ...styles, color: "white" };
          },
          placeholder: (styles, { isFocused }) => {
            return {
              ...styles,
              color: `rgba(255,255,255,${isFocused ? 0.85 : 0.4})`,
            };
          },
        }}
      />
    </div>
  );
};

export default Search;
