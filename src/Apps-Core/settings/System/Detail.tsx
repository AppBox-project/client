import React from "react";
import { AppContextType } from "../../../Utils/Types";
import SettingsSystemNotification from "./Notification";

const SettingsSystemDetail: React.FC<{
  match: { params: { detailId } };
  context: AppContextType;
}> = ({
  match: {
    params: { detailId },
  },
  context,
}) => (
  <>
    {detailId === "notification" && (
      <SettingsSystemNotification context={context} />
    )}
  </>
);

export default SettingsSystemDetail;
