import React, { useState } from "react";
import { useEffect } from "reactn";
import { AppContextType } from "../../../Utils/Types";

interface NotificationSettingType {
  gcmApiKey: string;
  vapid: { subject: string; publicKey: string; privateKey: string };
}

const SettingsSystemNotification: React.FC<{ context: AppContextType }> = ({
  context,
}) => {
  // Vars
  const [notificationSetting, setNotificationSetting] = useState<
    NotificationSettingType
  >();
  // Lifecycle
  useEffect(() => {
    context.getSystemSettings("notification").then((response) => {
      if (response.reason) {
        console.log(response.reason);
      } else {
        setNotificationSetting(response.value);
      }
    });
  }, []);

  // UI
  return (
    <context.UI.Animations.Animation>
      <context.UI.Design.Card withBigMargin title="Notification settings">
        Test
      </context.UI.Design.Card>
    </context.UI.Animations.Animation>
  );
};

export default SettingsSystemNotification;
