import * as React from "react";
import "./Button.scss";

type Props = {
  children: React.ReactNode;
  state: "primary" | "tertiary" | "danger" | "secondary";
  type: "submit" | "reset" | "button";
  onClick?: () => void;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
};

export default function Button(props: Props) {
  const { children, type, onClick, size, disabled, state } = props;
  return (
    <button
      {...props}
      className={`btn btn-${state}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
