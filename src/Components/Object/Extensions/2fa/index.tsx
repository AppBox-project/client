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
            context.setDialog({
              display: true,
              title: `Configure 2FA for ${
                object.data[extension.username_field]
              } `,
            });
          },
        },
      },
    },
  };
};
