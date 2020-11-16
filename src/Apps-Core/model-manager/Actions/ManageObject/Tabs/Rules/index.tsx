import React, { useEffect, useState } from "react";
import {
  ModelType,
  UIType,
  AppContextType,
  ModelRuleType,
  ListDetailItemType,
} from "../../../../../../Utils/Types";
import AppActionManageObjectTabRulesDetail from "./Detail"
import { map } from "lodash"

const AppActionManageObjectTabRules: React.FC<{
  model: ModelType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // Vars
  const [rulesList, setRulesList] = useState<ListDetailItemType[]>()

  // Lifecycle
  useEffect(() => {
    const nr: ListDetailItemType[] = []
    map(model.rules, (rule, key) => {
      nr.push({ label: rule.name, id: key, subtitle: rule.checkedOn })
    })
    setRulesList(nr)
  }, []);

  // UI
  return (
    <context.UI.Layouts.ListDetailLayout title="Rules" addFunction={() => {
      context.setDialog({
        display: true, title: "New rule", form: [{ key: "name", label: "Name" }, { key: "key", label: "Key" }, { key: "checkedOn", label: "Checked on", value: "All", type: "dropdown", dropdownOptions: [{ label: "Always", value: 'All' }, { label: "Insert", value: 'Insert' }, { label: "Update", value: 'Update' }, { label: "Delete", value: 'Delete' }, { label: "Insert and update", value: 'InsertAndUpdate' }, { label: "Insert and delete", value: 'InsertAndDelete' }, { label: "Update and delete", value: 'UpdateAndDelete' }, { label: "Never", value: 'Never' }] }], buttons: [{
          label: "Add", onClick: (form) => {
            context.updateModel(model.key, { ...model, rules: { ...model.rules, [form.key]: { name: form.name, checkedOn: form.checkedOn } } }, model._id)
            context.setDialog({ display: false })
          }
        }]
      })
    }} navWidth={2} context={context} list={rulesList} baseUrl={`/model-manager/${model.key}/rules`} DetailComponent={AppActionManageObjectTabRulesDetail} detailComponentProps={{ model }} />
  );
};

export default AppActionManageObjectTabRules;