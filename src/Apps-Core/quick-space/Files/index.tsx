import React, { useState, useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import AppQSActionFileLoadingSkeleton from "./LoadingSkeleton";
import AppQSActionFileDetail from "./DetailComponent";
import { List, ListItem, ListItemText, Divider } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const AppQSActionFile: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [files, setFiles] = useState();
  const [model, setModel] = useState();
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    const fileRequest = context.getObjects(
      "qs-files",
      { "data.owner": context.user._id },
      (response) => {
        if (response.success) {
          setFiles(response.data);
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
    };
  }, []);

  // UI
  if (!files || !model) return <AppQSActionFileLoadingSkeleton />;
  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      DetailComponent={AppQSActionFileDetail}
      list={files}
      baseUrl="/quick-space/files"
      navWidth={2}
      customNavComponent={
        <>
          <div style={{ marginBottom: 25 }}>
            <context.UI.Layouts.Object.ObjectLayout
              appId={context.appId}
              layoutId="dropzone"
              model={model}
              defaults={{ owner: context.user._id }}
            />
          </div>
          <Divider />
          <List>
            {files.map((file) => {
              return (
                <ListItem
                  button
                  key={file._id}
                  onClick={() => {
                    history.push(`/quick-space/files/${file._id}`);
                  }}
                >
                  <ListItemText>{file._id}</ListItemText>
                </ListItem>
              );
            })}
          </List>
        </>
      }
    />
  );
};

export default AppQSActionFile;
