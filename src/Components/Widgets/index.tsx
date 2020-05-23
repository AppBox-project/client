import React, { useGlobal } from "reactn";
import { WidgetContext } from "./Widgetcontext";

const Widget: React.FC<{ widgetMeta }> = ({ widgetMeta }) => {
  const Widget = require(`../../Apps-Core/${widgetMeta.app}/Widgets/${widgetMeta.widget}/index`)
    .default;
  const [user] = useGlobal<any>("user");

  const widgetContext = new WidgetContext(widgetMeta.app, user);
  return <Widget {...widgetMeta.props} context={widgetContext} />;
};

export default Widget;
