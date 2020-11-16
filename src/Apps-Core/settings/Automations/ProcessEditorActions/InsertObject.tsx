import React, { useEffect, useState } from "react";
import InputSelect from "../../../../Components/Inputs/Select";
import ObjectDesigner from "../../../../Components/ObjectDesigner/Create";
import { CustomFormInputType, ModelType } from "../../../../Utils/Types";
import { find } from "lodash";

const InsertObject: React.FC<CustomFormInputType> = ({
  onChange,
  context,
  value,
}) => {
  // Vars
  const [models, setModels] = useState<ModelType[]>([]);
  const [modelList, setModelList] = useState<{ label; value }[]>([]);
  const [newVal, setNewVal] = useState<{ model?: string; object: {} }>(
    value ? JSON.parse(value) : {}
  );

  // Functions
  const callback = (v) => {
    setNewVal(v);
    onChange(JSON.stringify(v));
  };

  // Lifecycle
  useEffect(() => {
    const modelRequest = context.getModels({}, (response) => {
      if (response.success) {
        setModels(response.data);
        const nm = [];
        response.data.map((model: ModelType) =>
          nm.push({ label: model.name, value: model.key })
        );
        setModelList(nm);
      } else {
        console.log(response);
      }
    });

    return () => modelRequest.stop();
  }, []);

  // UI
  if (!models) return <context.UI.Loading />;
  const newModel =
    newVal.model && find(models, (m: ModelType) => m.key === newVal.model);

  return (
    <>
      <InputSelect
        options={modelList}
        label="New object's model"
        value={newVal.model || ""}
        onChange={(val) => {
          callback({ ...newVal, model: val });
        }}
      />
      {newVal.model && (
        <ObjectDesigner
          context={context}
          model={newModel}
          value={newVal.object}
          onChange={(value) => {
            callback({ ...newVal, object: value });
          }}
        />
      )}
    </>
  );
};

export default InsertObject;
