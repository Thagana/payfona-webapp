import * as React from "react";
import "./Description.scss";

type Props = {
  description: string;
};

export default function Description(props: Props) {
  const { description } = props;
  return (
    <div className="description">
      <div className="description-text">{description}</div>
    </div>
  );
}
