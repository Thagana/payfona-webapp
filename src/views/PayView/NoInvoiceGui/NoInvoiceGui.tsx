import * as React from "react";

type Props = {
  reason: "NETWORK_ERROR" | "NO_INVOICE_FOUND" | "UNKNOWN_ERROR";
};

export default function NoInvoiceGui(props: Props) {
  const { reason } = props;
  return <div>In Invoice Found: {reason}</div>;
}
