import * as React from "react";
import { RightOutlined } from '@ant-design/icons'
import './Invoice.scss';
import InvoiceStatus from "../InvoiceStatus";
import { formatInTimeZone } from 'date-fns-tz'
import { parseISO } from 'date-fns';

type Props = {
  status: 'PENDING' | 'PAID' | 'DRAFT',
  total: number;
  invoiceNumber: string;
  name: string;
  email: string;
  date: string;
  invoiceId: string;
}

export default function Invoice(props: Props) {
  const { invoiceNumber, status, total, name, date, invoiceId } = props;
  const parsed = parseISO(date);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const invoiceDateTime = formatInTimeZone(parsed, timeZone, 'dd MMM yyyy');
  return (
    <a href={`/invoices/${invoiceId}`} className="invoice">
      <div className="details">
        <div className="invoice-number">#{invoiceNumber}</div>
        <div className="invoice-date">{invoiceDateTime}</div>
        <div className="invoice-name">{name}</div>
        <div className="invoice-total">R {total}</div>
      </div>
      <div className="invoice-status">
        <InvoiceStatus status={status} />
        <RightOutlined className="right-icon"/>
      </div>
    </a>
  );
}
