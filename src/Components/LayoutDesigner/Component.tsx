import React from "react";
import { useDrag } from "react-dnd";
import styles from "./styles.module.scss";

const Component: React.FC<{ label; id: string }> = ({ label, id }) => {
  const [, drag] = useDrag({ item: { type: "box", id } });
  return (
    <div ref={drag} className={styles.component}>
      {label}
    </div>
  );
};
export default Component;
