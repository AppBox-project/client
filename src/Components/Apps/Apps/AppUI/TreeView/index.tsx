import React, { useGlobal } from "reactn";
import TreeView from "@material-ui/lab/TreeView";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { TreeItem } from "@material-ui/lab";
import { Typography } from "@material-ui/core";
import styles from "./styles.module.scss";
import { useHistory } from "react-router-dom";

interface DataItem {
  key: string;
  label: string;
  icon: React.FC;
  subItems?: DataItem[];
}

const RenderChildren: React.FC<{ items: DataItem[]; linkTo?: string }> = ({
  items,
  linkTo,
}) => {
  // Vars
  const history = useHistory();

  // UI
  return (
    <>
      {items.map((item) => {
        const ItemIcon: React.FC<{ className }> = item.icon;
        return (
          <TreeItem
            key={item.key}
            nodeId={item.key}
            label={
              <div
                className={styles.labelRoot}
                onClick={() => {
                  history.push(`${linkTo}/${item.key}`); // On desktop, entire item is clickable
                }}
              >
                <ItemIcon className={styles.labelIcon} />
                <Typography variant="body2" className={styles.labelText}>
                  {item.label}
                </Typography>
              </div>
            }
          >
            {item.subItems && (
              <RenderChildren linkTo={linkTo} items={item.subItems} />
            )}
          </TreeItem>
        );
      })}
    </>
  );
};
const TreeViewUI: React.FC<{
  items: DataItem[];
  linkTo?: string;
}> = ({ items, linkTo }) => {
  return (
    <TreeView
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
    >
      <RenderChildren linkTo={linkTo} items={items} />
    </TreeView>
  );
};

export default TreeViewUI;
