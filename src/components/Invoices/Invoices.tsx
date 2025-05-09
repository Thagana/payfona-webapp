import * as React from "react";
import Invoice from "../Invoice";
import "./Invoices.scss";

type Invoices = {
  status: "PENDING" | "PAID" | "DRAFT";
  total: number;
  invoiceNumber: string;
  name: string;
  email: string;
  date: string;
  invoiceId: string;
};

type Props = {
  data: {
    invoices: Invoices[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
};

export default function Invoices(props: Props) {
  const { invoices, totalItems } = props.data;

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
