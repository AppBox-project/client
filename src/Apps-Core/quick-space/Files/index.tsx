import React, { useState, useEffect } from "react";
import { AppContextType, ListItemType } from "../../../Utils/Types";
import AppQSActionFileLoadingSkeleton from "./LoadingSkeleton";
import AppQSActionFileDetail from "./DetailComponent";
import { AppFileType } from "../Types";
import { format } from "date-fns";

const AppQSActionFile: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [files, setFiles] = useState<ListItemType[]>([]);
  const [model, setModel] = useState<any>();

  // Lifecycle
  useEffect(() => {
    const fileRequest = context.getObjects(
      "qs-files",
      { "data.owner": context.user._id },
      (response) => {
        if (response.success) {
          const nf: ListItemType[] = [];
          response.data.map((file: AppFileType) =>
            nf.push({ label: file.data.name, id: file._id })
          );
          setFiles(nf);
        } else {
          console.log(response);
        }
      }
    );

    // Model
    const modelRequest = context.getModel("qs-files", (response) => {
      if (response.success) {
        setModel(response.data);
      } else {
        console.log(response);
      }
    });
    return () => {
      fileRequest.stop();
      modelRequest.stop();
    };
  }, []);

  // UI
  if (!files || !model) return <AppQSActionFileLoadingSkeleton />;

  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      DetailComponent={AppQSActionFileDetail}
      detailComponentProps={{ model }}
      list={files}
      baseUrl="/quick-space/files"
      title="Files"
      customNavItems={[
        <context.UI.Layouts.Object.ObjectLayout
          model={model}
          modelId="qs-file"
          layoutId="create"
          baseUrl={`/quick-space/files`}
          context={context}
          defaults={{
            owner: context.user._id,
            name: format(new Date(), "MMMM d y HH:mm"),
          }}
          style={{ width: "100%" }}
        />,
      ]}
    />
  );
};

export default AppQSActionFile;
