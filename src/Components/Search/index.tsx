import React, { useState, useEffect, useRef } from "reactn";
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
  IconButton,
  ListItemSecondaryAction,
  Tooltip,
  Menu,
  MenuItem,
} from "@material-ui/core";
import * as icons from "react-icons/fa";
import { MdLaunch } from "react-icons/md";
import { useHistory } from "react-router";
import { ModelType } from "../../Utils/Types";
import { find, size } from "lodash";

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
  const [anchorEl, setAnchorEl] = useState<any>(null); // Where to show 'opens in' menu
  const [objectOpensIn, setObjectOpensIn] = useState<any>(); // What to show in 'opens in' menu

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
      type: "app",
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
      <Menu
        id="open-in-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
          }}
        >
          Todo: improve and show handler apps
        </MenuItem>
      </Menu>

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
                <List>{props.children}</List>
              </components.MenuList>
            );
          },
          Option: (props, { innerProps, innerRef, selectOption }) => {
            const model: ModelType = models[props.data.obj.type];
            const ActionIcon = icons[model.icon];
            const compatibleApps = {
              "data-explorer": "/data-explorer/{model.key}/{object._id}",
              ...model.handlers,
            };
            const defaultHandler = compatibleApps[model.app]
              ? model.app
              : "data-explorer";
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
                      <ActionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    ref={innerRef}
                    {...innerProps}
                    primary={props.data.label}
                    secondary={model.name}
                  />
                  {size(compatibleApps) > 1 && (
                    <Tooltip placement="right" title="Open in">
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={(event) => {
                            setAnchorEl(event.currentTarget);
                            event.stopPropagation();
                          }}
                        >
                          <MdLaunch />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </Tooltip>
                  )}
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
          control: (styles) => ({
            ...styles,
            backgroundColor: "rgba(255,255,255,0.1)",
            border: 0,
            color: "white",
          }),
          option: (provided, state) => ({
            ...provided,
            borderBottom: "1px solid #efefef",
            color: state.isSelected ? "white" : "black",
            padding: 20,
          }),
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
