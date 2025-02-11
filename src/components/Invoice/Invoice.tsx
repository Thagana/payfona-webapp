import * as React from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import "./Invoice.scss";

interface DataType {
  key: string;
  description: string;
  quantity: number;
  amount: number;
  price: number;
}

interface Invoice {
  from: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  to: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  invoice_number: string;
  invoice_date: string;
  payment_link: string,
  logo: string;
  items: {
    key: string;
    description: string;
    quantity: number;
    price: number;
    amount: number;
  }[]
  currency: "ZAR" | "USD"
}

type Props = {
  status: "PENDING" | "PAID" | "DRAFT"
  name: string
  total: number
  invoiceNumber: string
  email: string
  date: string
  invoiceId: string
}

export default function Invoice(props: Props) {
  const search = queryString.parse(useLocation().search) as unknown as {
    payload: string;
  };
  const payload = JSON.parse(search.payload) as Invoice;
  const { to, from, invoice_date, invoice_number, items, payment_link, currency } = payload

  const columns: ColumnsType<DataType> = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => <span>{record.price}</span>,
    },
    {
      title: "qty",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => <span>{record.price * record.quantity}</span>,
    },
  ];
  const data: DataType[] = items;

  return (
    <div className="invoice-view">
      <div>
        <div className="header">
          <div className="title">
            <span>Invoice</span>
          </div>
          <div className="logo-container">
            <img
              src={payload.logo ? payload.logo : "https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4"}
              className="logo"
            />
          </div>
        </div>
        <div className="details-container">
          <div className="details-from">
            <div className="from">From</div>
            <div className="name">{from.name}</div>
            <div className="email">{from.email}</div>
            <div className="phone-number">{from.phoneNumber}</div>
          </div>
          <div className="details-for">
            <div className="for">For</div>
            <div className="name">{to.name}</div>
            <div className="email">{to.email}</div>
            <div className="phone-number">{to.phoneNumber}</div>
          </div>
        </div>
        <div className="invoice-meta">
          <div className="number">Number: {invoice_number}</div>
          <div className="date">Date: {invoice_date}</div>
        </div>
        <div className="invoice-items">
          <Table dataSource={data} columns={columns} pagination={false} />
        </div>
        <div className="sub-table">
          <div className="total">
            Total: {currency} {' '}
            {data.reduce((a, b) => {
              return a + b.price * b.quantity;
            }, 0)}
          </div>
        </div>
        <div className="pay-now-link">
          <a href={payment_link} className="pay-now-link">Pay Now!</a>
        </div>
        <div className="invoice-footer">
          Copy right reserved for company @ payfona.com {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
