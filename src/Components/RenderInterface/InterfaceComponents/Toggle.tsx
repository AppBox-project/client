import React from "react";
import InputSwitch from "../../Inputs/Switch";

const RenderInterfaceToggle: React.FC<{
  value: boolean;
  onChange: (newVal: boolean) => void;
  labelWhenTrue: string;
  labelWhenFalse: string;
}> = ({ value, onChange, labelWhenTrue, labelWhenFalse }) => {
  return (
    <InputSwitch
      label={value ? labelWhenTrue : labelWhenFalse}
      value={value}
      onChange={(newVal) => onChange(newVal)}
    />
  );
};

export default RenderInterfaceToggle;
