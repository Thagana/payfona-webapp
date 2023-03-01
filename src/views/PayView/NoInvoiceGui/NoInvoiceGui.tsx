import * as React from "react";
import TemplateWrapper from "../../Template";

import './NoInvoice.scss';

type Props = {
  reason: "NETWORK_ERROR" | "NO_INVOICE_FOUND" | "UNKNOWN_ERROR";
};

export default function NoInvoiceGui(props: Props) {
  const { reason } = props;
  return (
      <div className="no-invoice-found">In Invoice Found: {reason}</div>
  );
}
