import React from "react";
import { AppContextType } from "../../../../Utils/Types";

const AppQSSettingsProjectDetail: React.FC<{
  context: AppContextType;
  match: { params: { detailId } };
}> = ({
  context,
  match: {
    params: { detailId },
  },
}) => {
  return <>Test</>;
};

export default AppQSSettingsProjectDetail;
