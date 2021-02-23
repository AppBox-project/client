import React from "react";
import { useDrag } from "react-dnd";
import styles from "./styles.module.scss";

const Component: React.FC<{ id: string; children }> = ({ id, children }) => {
  const [, drag] = useDrag({ item: { type: "box", id } });
  return (
    <div ref={drag} className={styles.draggable}>
      {children}
    </div>
  );
};
export default Component;
