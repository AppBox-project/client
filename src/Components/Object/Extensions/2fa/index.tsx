import React from "react";
import { ModelType, AppContextType, ObjectType } from "../../../../Utils/Types";

export default (
  extension,
  context: AppContextType,
  object: ObjectType = undefined
) => {
  return {
    provides: {
      buttons: {
        configure: {
          label: "Configure 2FA",
          variant: "outlined",
          onClick: () => {
            context
              .requestServerAction("setUp2FA", {
                appName: extension.app_name,
                name: object.data[extension.username_field],
              })
              .then((mfa) => {
                console.log(mfa);

                context.setDialog({
                  display: true,
                  title: `Configuring 2FA for ${
                    object.data[extension.username_field]
                  }`,
                  content: (
                    <>
                      <img src={mfa.qr} />
                      <br />
                      Or copy {mfa.secret}
                    </>
                  ),
                  form: [
                    { label: "Enter your token", key: "token", type: "text" },
                  ],
                  buttons: [
                    {
                      label: "Save",
                      onClick: (form) => {
                        context
                          .requestServerAction("compareSecretAndToken", {
                            secret: mfa.secret,
                            token: form.token,
                            objectId: object._id,
                            enabled_field: extension["2fa_enabled_field"],
                            secret_field: extension["2fa_secret_field"],
                            qr_field: extension["2fa_qr_field"],
                            qr: mfa.qr,
                          })
                          .then((response) => context.showSnackbar(response));
                      },
                    },
                  ],
                });
              });
          },
        },
      },
    },
  };
};
