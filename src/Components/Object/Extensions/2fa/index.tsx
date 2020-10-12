import React from "react";
import { AppContextType, ObjectType } from "../../../../Utils/Types";
import { Typography } from "@material-ui/core";
import QRCode from "qrcode.react";

export default (
  extension,
  context: AppContextType,
  object: ObjectType = undefined
) =>
  new Promise((resolve, reject) => {
    resolve({
      provides: {
        buttons: {
          configure: {
            label: "Configure 2FA",
            variant: "outlined",
            onClick: () => {
              if (object.data[extension["2fa_enabled_field"]]) {
                context.setDialog({
                  display: true,
                  title: `Configuring 2FA for ${
                    object.data[extension.username_field]
                  }`,
                  content: "This account is secured with MFA.",
                  buttons: [
                    {
                      label: (
                        <Typography style={{ color: "green" }} variant="button">
                          Good! Keep it that way.
                        </Typography>
                      ),
                      onClick: () => context.setDialog({ display: false }),
                    },

                    {
                      label: (
                        <Typography style={{ color: "red" }} variant="button">
                          Turn off
                        </Typography>
                      ),
                      onClick: () => context.setDialog({ display: false }),
                    },
                  ],
                });
              } else {
                context
                  .requestServerAction("setUp2FA", {
                    appName: extension.app_name,
                    name: object.data[extension.username_field],
                    id: object._id,
                  })
                  .then((mfa) => {
                    if (mfa.success) {
                      const url = `otpauth://totp/AppBox:${
                        object.data[extension.username_field]
                      }?secret=${mfa.secret}&issuer=AppBox`;

                      context.setDialog({
                        display: true,
                        title: `Configuring 2FA for ${
                          object.data[extension.username_field]
                        }`,
                        content: (
                          <>
                            <Typography variant="body1">
                              MFA requires you to enter a code when you log in,
                              drastically improving the security. If someone
                              manages to get your password, they still can't get
                              in without your permission.
                            </Typography>
                            <QRCode value={url} />
                            <br />
                            <Typography variant="body1">
                              Or copy{" "}
                              <a href={url} target="_blank">
                                {mfa.secret}
                              </a>
                            </Typography>
                          </>
                        ),
                        form: [
                          {
                            label: "Confirm that you have the right token",
                            key: "token",
                            type: "text",
                          },
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
                                  qr: url,
                                })
                                .then((response) =>
                                  context.showSnackbar(response)
                                );
                            },
                          },
                        ],
                      });
                    } else {
                      context.setDialog({
                        display: true,
                        title: "Can't activate MFA",
                        content: `${
                          object.data[extension.username_field]
                        } has to do it themselves.`,
                      });
                    }
                  });
              }
            },
          },
        },
      },
    });
  });
