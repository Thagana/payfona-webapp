import * as React from "react";
import "./Button.scss";

type Props = {
  children: React.ReactNode;
  state: "primary" | "tertiary" | "danger";
  type: "submit" | "reset" | "button";
  clickHandler?: () => void;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
};

export default function Button(props: Props) {
  const { children, type, clickHandler, size, disabled, state } = props;
  return (
    <button
      {...props}
      className={`btn btn-${state}`}
      onClick={clickHandler}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
