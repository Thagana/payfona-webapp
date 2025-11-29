import * as React from "react";
import "./InvoiceStatus.scss";

type Props = {
  status: "PENDING" | "PAID" | "DRAFT";
};

export default function InvoiceStatus(props: Props) {
  const { status } = props;
  const getBackgroundColor = (state: string) => {
    switch (state) {
      case "PENDING":
        return "rgba(255, 143, 0, 0.06)";
      case "PAID":
        return "rgb(51, 214, 159, 0.06)";
      default:
        return "rgba(55, 59, 83, 0.06)";
    }
  };
  const getColor = (state: string) => {
    switch (state) {
      case "PENDING":
        return "rgba(255, 143, 0)";
      case "PAID":
        return "rgb(51, 214, 159)";
      default:
        return "rgba(55, 59, 83)";
    }
  };
  return (
    <div className="status" style={{ background: getBackgroundColor(status) }}>
      <div className="dot" style={{ background: getColor(status) }}></div>
      <div className="status-text" style={{ color: getColor(status) }}>
        {status}
      </div>
    </div>
  );
}
