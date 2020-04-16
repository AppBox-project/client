import React, { useState, useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import { TreeView, TreeItem } from "@material-ui/lab";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import MailIcon from "@material-ui/icons/Mail";
import DeleteIcon from "@material-ui/icons/Delete";
import Label from "@material-ui/icons/Label";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import InfoIcon from "@material-ui/icons/Info";
import ForumIcon from "@material-ui/icons/Forum";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import AppQSNotesDetail from "./NotesDetail";

const AppQSActionNotes: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [projects, setProjects] = useState();

  // Lifecycle
  useEffect(() => {
    context.getObjects("qs-project", {}, (response) => {
      if (response.success) {
        setProjects(response.data);
      } else {
        console.log(response);
      }
    });
  }, []);

  // UI
  if (!projects) return <context.UI.Loading />;
  return (
    <>
      <context.UI.ListDetailLayout
        baseUrl="/quick-space/notes"
        mode="tree"
        treeList={[
          {
            key: "test",
            label: "test",
            icon: DeleteIcon,
            subItems: [
              {
                key: "sub1",
                label: "sub1",
                icon: DeleteIcon,
                subItems: [
                  {
                    key: "subsub1",
                    label: "subsub1",
                    icon: DeleteIcon,
                    subItems: [
                      {
                        key: "subsub1",
                        label: "subsub1",
                        icon: DeleteIcon,
                      },
                      {
                        key: "subsub2",
                        label: "subsub2",
                        icon: DeleteIcon,
                      },
                    ],
                  },
                  { key: "subsub2", label: "subsub2", icon: DeleteIcon },
                ],
              },
            ],
          },
          { key: "test2", label: "test2", icon: DeleteIcon },
        ]}
        context={context}
        DetailComponent={AppQSNotesDetail}
      />
    </>
  );
};

export default AppQSActionNotes;
