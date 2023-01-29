import * as React from "react";
import Invoice from "../Invoice";

import "./Invoices.scss";

interface Props {
  invoices: {
    status: "PENDING" | "PAID" | "DRAFT";
    total: number;
    invoiceNumber: string;
    name: string;
    email: string;
    date: string;
    invoiceId: string;
  }[];
}

export default function Invoices(props: Props) {
  const { invoices } = props;
  return (
    <div className="invoices">
      {invoices.map((invoice) => {
        return (
          <Invoice
            key={invoice.invoiceNumber}
            status={invoice.status}
            name={invoice.name}
            total={invoice.total}
            invoiceNumber={invoice.invoiceNumber}
            email={invoice.email}
            date={invoice.date}
            invoiceId={invoice.invoiceId}
          />
        );
      })}
    </div>
  );
}
