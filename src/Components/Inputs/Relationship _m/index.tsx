import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import uniqid from "uniqid";
import Server from "../../../Utils/Server";
import { useGlobal } from "reactn";

function arrayMove(array, from, to) {
  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
  return array;
}

const SortableMultiValue = SortableElement((props) => {
  // this prevents the menu from being opened/closed when the user clicks
  // on a value to begin dragging it. ideally, detecting a click (instead of
  // a drag) would still focus the control and toggle the menu, but that
  // requires some magic with refs that are out of scope for this example
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const innerProps = { onMouseDown };
  return <components.MultiValue {...props} innerProps={innerProps} />;
});
const SortableSelect = SortableContainer(Select);

const InputRelationShipM: React.FC<{
  label: string;
  objectType: string;
  onChange?: (value) => void;
  value?: string[];
}> = ({ label, objectType, onChange, value }) => {
  // Vars
  const [selected, setSelected] = useState<any>([]);
  const [options, setOptions] = useState<any>();
  const [app] = useGlobal<any>("app");

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newValue = arrayMove(selected, oldIndex, newIndex);
    setSelected(newValue);
    const result = [];
    newValue.map((o) => result.push(o.value));
    if (onChange) onChange(result);
    console.log(result);
  };

  // Lifecycle
  useEffect(() => {
    const modelRequest = uniqid();
    Server.emit("listenForObjectTypes", {
      requestId: modelRequest,
      filter: { key: objectType },
    });
    Server.on(`receive-${modelRequest}`, (response) => {
      const model = response[0];
      const optionsRequest = uniqid();
      Server.emit("listenForObjects", {
        requestId: optionsRequest,
        type: objectType,
        filter: {},
      });
      Server.on(`receive-${optionsRequest}`, (response) => {
        if (response.success) {
          const newOptions = [];
          const newSelected = [];
          response.data.map((item) => {
            if (value) {
              if (value.includes(item._id)) {
                newSelected.push({
                  label: item.data[model.primary],
                  value: item._id,
                });
              }
            }
            newOptions.push({
              label: item.data[model.primary],
              value: item._id,
            });
          });
          setOptions(newOptions);
          setSelected(newSelected);
        } else {
          console.log(response);
        }
      });
    });

    return () => {
      Server.emit("unlistenForObjectTypes", {
        requestId: modelRequest,
      });
    };
  }, [objectType]);

  // UI
  return (
    <SortableSelect
      // react-sortable-hoc props:
      axis="xy"
      onSortEnd={onSortEnd}
      distance={4}
      getHelperDimensions={({ node }) => node.getBoundingClientRect()}
      isMulti
      options={options}
      value={selected}
      onChange={(selectedOptions) => {
        setSelected(selectedOptions);
        const result = [];
        if (selectedOptions) selectedOptions.map((o) => result.push(o.value));
        if (onChange) onChange(result);
      }}
      components={{
        MultiValue: SortableMultiValue,
      }}
      closeMenuOnSelect={false}
      styles={{
        menu: (styles) => ({
          ...styles,
          zIndex: 101,
        }),
        control: (styles) => ({
          ...styles,
          position: "relative",
          zIndex: 100,
        }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
          return {
            ...styles,
            backgroundColor: isSelected
              ? `rgba(${app.data.color.r},${app.data.color.g},${app.data.color.b},1)`
              : isFocused &&
                `rgba(${app.data.color.r},${app.data.color.g},${app.data.color.b},0.4)`,
          };
        },
      }}
    />
  );
};

export default InputRelationShipM;
