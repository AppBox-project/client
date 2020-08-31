import React from "react";
import { Tabs, makeStyles, Tab } from "@material-ui/core";
import Loading from "../../../Loading";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  customTabRoot: {
    color: "white",
  },
  customTabIndicator: {
    backgroundColor: "white",
  },
}));

const ObjectLayoutItemTabContainer: React.FC<{
  tabs;
  layoutItem;
  baseUrl?: string;
  items: {};
}> = ({ tabs, layoutItem, baseUrl, items }) => {
  // Vars
  const currentTab = (
    window.location.href.split(`${layoutItem.identifier}-`)[1] ||
    `${tabs[0].identifier}/`
  ).split("/")[0];
  const history = useHistory();
  const classes = useStyles();

  // Lifecycle

  // UI
  if (!tabs) return <Loading />;
  return (
    <>
      <Tabs
        value={currentTab}
        onChange={(event, value) => {
          history.push(`${baseUrl}/${layoutItem.identifier}-${value}/`);
        }}
        aria-label="Object tabs navigation"
        variant="scrollable"
        classes={{
          root: classes.customTabRoot,
          indicator: classes.customTabIndicator,
        }}
      >
        {tabs.map((tab) => (
          <Tab label={tab.title} value={tab.identifier} />
        ))}
      </Tabs>
      {items[currentTab].map((TabItem) => TabItem)}
    </>
  );
};

export default ObjectLayoutItemTabContainer;
