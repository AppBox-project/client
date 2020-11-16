import React, { useEffect } from "react";
import { AppContextType } from "../../../../Utils/Types";
import { useState } from "reactn";
import { ListDetailItemType } from "../../../../Utils/Types";
import { AppTagType } from "../../Types";
import AppQSSettingsTagDetail from "./Detail";
import { Avatar } from "@material-ui/core";
import { FaTags } from "react-icons/fa";

const AppSettingsTags: React.FC<{
  context: AppContextType;
  isMobile: boolean;
}> = ({ context, isMobile }) => {
  // Vars
  const [tags, setTags] = useState<{ [key: string]: AppTagType }>({});
  const [tagsList, setTagsList] = useState<ListDetailItemType[]>([]);

  // Lifecycle
  useEffect(() => {
    context.getObjects("qs-tags", {}, (response) => {
      if (response.success) {
        const tl: ListDetailItemType[] = [];
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
      detailComponentProps={{ tags, isMobile }}
      context={context}
      list={tagsList}
      title="Tags"
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
            <context.UI.Object.Detail
              modelId="qs-tags"
              layoutId="create"
              popup
              context={context}
            />
          ),
        });
      }}
      style={{ paddingBottom: isMobile && 60 }}
    />
  );
};

export default AppSettingsTags;
