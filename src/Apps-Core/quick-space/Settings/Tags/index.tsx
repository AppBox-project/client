import React, { useEffect } from "react";
import { AppContextType } from "../../../../Utils/Types";
import { useState } from "reactn";
import { ListItemType } from "../../../../Utils/Types";
import { AppTagType } from "../../Types";
import AppQSSettingsTagDetail from "./Detail";
import { Avatar } from "@material-ui/core";
import { FaTags } from "react-icons/fa";

const AppSettingsTags: React.FC<{ context: AppContextType }> = ({
  context,
}) => {
  // Vars
  const [tags, setTags] = useState<{ [key: string]: AppTagType }>({});
  const [tagsList, setTagsList] = useState<ListItemType[]>([]);

  // Lifecycle
  useEffect(() => {
    context.getObjects("qs-tags", {}, (response) => {
      if (response.success) {
        const tl: ListItemType[] = [];
        const to = {};
        response.data.map((t: AppTagType) => {
          tl.push({ label: t.data.name, id: t._id });
          to[t._id] = t;
        });
        setTags(to);
        setTagsList(tl);
      } else {
        console.log(response);
      }
    });
  }, []);

  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      baseUrl="/quick-space/settings/tags"
      DetailComponent={AppQSSettingsTagDetail}
      detailComponentProps={{ tags }}
      context={context}
      list={tagsList}
      title="tags"
      navDynamicIcon={(listItem) => {
        const tag = tags[listItem.id];
        return (
          <Avatar
            style={{
              width: 30,
              height: 30,
              backgroundColor: `rgb(${tag.data.color.r},${tag.data.color.g},${tag.data.color.b})`,
            }}
          >
            <FaTags style={{ height: 18, width: 18 }} />
          </Avatar>
        );
      }}
      addFunction={() => {
        context.setDialog({
          display: true,
          title: "New tag",
          content: (
            <context.UI.Layouts.Object.ObjectLayout
              modelId="qs-tags"
              layoutId="create"
              popup
              context={context}
            />
          ),
        });
      }}
      style={{ height: "100%" }}
    />
  );
};

export default AppSettingsTags;
