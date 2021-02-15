import React from "react";
import MaybeCard from "../Design/MaybeCard";

const Todo: React.FC<{ withCard?: true; title?: string }> = ({
  withCard,
  title,
}) => {
  return (
    <MaybeCard showCard={withCard} withBigMargin title={title}>
      This feature still needs to be built.
    </MaybeCard>
  );
};

export default Todo;
