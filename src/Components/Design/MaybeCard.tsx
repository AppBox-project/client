import React from "react";
import Card, { CardProps } from "./Card";

interface MaybeCardProps extends CardProps {
  showCard: boolean;
}

const MaybeCard: React.FC<MaybeCardProps> = ({
  showCard,
  children,
  ...props
}) => (showCard ? <Card {...props}>{children}</Card> : children);

export default MaybeCard;
