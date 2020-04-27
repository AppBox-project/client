import React from "react";
import { WidgetContext } from "./Widgetcontext";

const Widget: React.FC<{ widgetMeta }> = ({ widgetMeta }) => {
  const Widget = require(`../../Apps-Core/${widgetMeta.app}/Widgets/${widgetMeta.widget}/index`)
    .default;
  const widgetContext = new WidgetContext(widgetMeta.app);
  return <Widget {...widgetMeta.props} context={widgetContext} />;
};

export default Widget;
