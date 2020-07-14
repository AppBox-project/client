import React from "react";
import { useDrag } from "react-dnd";
import styles from "./styles.module.scss";
import Card from "../Design/Card";

const Component: React.FC<{ label; id: string }> = ({ label, id }) => {
  const [, drag] = useDrag({ item: { type: "box", id } });
  return (
    <div ref={drag} style={{ margin: "0 auto" }}>
      <Card style={{ cursor: "grab" }} hoverable>
        {label}
      </Card>
    </div>
  );
};
export default Component;
