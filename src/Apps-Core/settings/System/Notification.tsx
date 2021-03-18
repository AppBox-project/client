import { Button, Divider, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "reactn";
import { AppContextType } from "../../../Utils/Types";

interface NotificationSettingType {
  gcmApiKey?: string;
  vapid?: { subject: string; publicKey: string; privateKey: string };
}

const SettingsSystemNotification: React.FC<{ context: AppContextType }> = ({
  context,
}) => {
  // Vars
  const [notificationSetting, setNotificationSetting] = useState<
    NotificationSettingType
  >();
  const [
    originalNotificationSetting,
    setOriginalNotificationSetting,
  ] = useState<string>();
  // Lifecycle
  useEffect(() => {
    context.getSystemSettings("notification").then((response) => {
      if (response.reason) {
        console.log(response.reason);
      } else {
        setNotificationSetting(response.value);
        setOriginalNotificationSetting(JSON.stringify(response.value));
      }
    });
  }, []);

  // UI
  return (
    <context.UI.Animations.Animation>
      <context.UI.Design.Card withBigMargin title="Notification settings">
        <Typography variant="body1">GCM</Typography>
        <Divider style={{ marginBottom: 15 }} />
        <context.UI.Inputs.TextInput
          label="GCM API key"
          value={notificationSetting?.gcmApiKey || ""}
          onChange={(gcmApiKey: string) =>
            setNotificationSetting({
              ...(notificationSetting || {}),
              gcmApiKey,
            })
          }
        />
        <Typography variant="body1" style={{ marginTop: 15 }}>
          VAPID
        </Typography>
        <Divider style={{ marginBottom: 15 }} />
        <context.UI.Inputs.TextInput
          label="VAPID Subject"
          value={notificationSetting?.vapid?.subject || ""}
          onChange={(subject: string) =>
            setNotificationSetting({
              ...(notificationSetting || {}),
              vapid: { ...notificationSetting.vapid, subject },
            })
          }
        />
        <context.UI.Inputs.TextInput
          label="VAPID public key"
          value={notificationSetting?.vapid?.publicKey || ""}
          onChange={(publicKey: string) =>
            setNotificationSetting({
              ...(notificationSetting || {}),
              vapid: { ...notificationSetting.vapid, publicKey },
            })
          }
        />
        <context.UI.Inputs.TextInput
          label="VAPID private key"
          value={notificationSetting?.vapid?.privateKey || ""}
          onChange={(privateKey: string) =>
            setNotificationSetting({
              ...(notificationSetting || {}),
              vapid: { ...notificationSetting.vapid, privateKey },
            })
          }
        />
        {JSON.stringify(notificationSetting) !==
          originalNotificationSetting && (
          <Button
            color="primary"
            fullWidth
            variant="contained"
            onClick={() => {
              context
                .setSystemSettings("notification", notificationSetting)
                .then(() => {
                  setOriginalNotificationSetting(
                    JSON.stringify(notificationSetting)
                  );
                });
            }}
          >
            Save changes
          </Button>
        )}
      </context.UI.Design.Card>
    </context.UI.Animations.Animation>
  );
};

export default SettingsSystemNotification;
