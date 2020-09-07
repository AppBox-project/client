import React from "react";
import {
  AppContextType,
  ModelType,
  ValueListItemType,
} from "../../../../Utils/Types";
import { map } from "lodash";
import { useState, useEffect } from "reactn";

const ExtensionConfigure: React.FC<{
  onChange: (value) => void;
  context: AppContextType;
  modelExtension: any;
  model: ModelType;
}> = ({ onChange, context, modelExtension, model }) => {
  // Vars
  const [fieldList, setFieldList] = useState<ValueListItemType[]>([]);
  // Lifecycle
  useEffect(() => {
    const fl: ValueListItemType[] = [];
    map(model.fields, (value, key) =>
      fl.push({ label: value.name, value: key })
    );
    setFieldList(fl);
  }, []);

  // UI

  return (
    <>
      <context.UI.Inputs.TextInput
        label="App name"
        value={modelExtension.app_name}
        onChange={(value) => onChange({ ...modelExtension, app_name: value })}
      />
      <context.UI.Inputs.SelectInput
        label="2FA enabled field"
        options={fieldList}
        value={modelExtension["2fa_enabled_field"]}
        onChange={(value) =>
          onChange({ ...modelExtension, "2fa_enabled_field": value })
        }
      />
      <context.UI.Inputs.SelectInput
        label="2FA secret field"
        options={fieldList}
        value={modelExtension["2fa_secret_field"]}
        onChange={(value) =>
          onChange({ ...modelExtension, "2fa_secret_field": value })
        }
      />
      <context.UI.Inputs.SelectInput
        label="2FA QR field"
        options={fieldList}
        value={modelExtension["2fa_qr_field"]}
        onChange={(value) =>
          onChange({ ...modelExtension, "2fa_qr_field": value })
        }
      />
      <context.UI.Inputs.SelectInput
        label="Username field"
        options={fieldList}
        value={modelExtension["username_field"]}
        onChange={(value) =>
          onChange({ ...modelExtension, username_field: value })
        }
      />
      <context.UI.Inputs.CheckmarkInput
        label="Active"
        value={modelExtension.active}
        onChange={(value) => onChange({ ...modelExtension, active: value })}
      />
    </>
  );
};

export default ExtensionConfigure;
