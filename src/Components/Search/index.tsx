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
} from "@material-ui/core";
import * as icons from "react-icons/fa";
import { useHistory } from "react-router";

var debounce = require("debounce-promise");

const Search: React.FC<{ style?; setSearchExpanded? }> = ({
  style,
  setSearchExpanded,
}) => {
  // Vars
  const [isLoading, setIsLoading] = useState<any>(false);
  const [models, setModels] = useState<any>({});
  const history = useHistory();

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
  }, []);
  // UI
  return (
    <div style={style}>
      <AsyncSelect
        value={null}
        onChange={(chosen, e) => {
          if (setSearchExpanded) setSearchExpanded(false);
          history.push(
            `/data-explorer/${models[chosen?.obj?.type]?.key}/${
              chosen?.obj?.id
            }`
          );
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
            const model = models[props.data.obj.type];
            const ActionIcon = icons[model.icon];
            return (
              <components.Option {...props}>
                <ListItem ref={innerRef} {...innerProps}>
                  <ListItemAvatar>
                    <Avatar color="primary">
                      <ActionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
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
