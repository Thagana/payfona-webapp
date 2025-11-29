import * as React from "react";
import Table from "antd/es/table";
import type { ColumnsType } from "antd/es/table";
import Notification from "antd/es/notification";

import "./ViewInvoice.scss";

import { Invoice as InvoiceNetworking } from "../../networking/invoice";
import { useParams } from "react-router-dom";

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
  payment_link: string;
  logo: string;
  items: {
    key: string;
    description: string;
    quantity: number;
    price: number;
    amount: number;
  }[];
  currency: "ZAR" | "USD";
}

export default function Invoice() {
  const { invoiceId } = useParams();
  const [data, setData] = React.useState<Invoice>();

  const columns: ColumnsType<DataType> = [
    {
      title: "Description",
      dataIndex: "item",
      key: "item",
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

  const fetchInvoice = async () => {
    try {
      const response = await InvoiceNetworking.fetchInvoice(invoiceId || "");
      if (response.data.success) {
        setData(response.data.data.data);
      } else {
        Notification.error({
          message: response.data.message,
        });
      }
    } catch (error) {
      console.error(error);
      Notification.error({
        message: "Failed to find invoice",
      });
    }
  };

  React.useEffect(() => {
    fetchInvoice();
  }, []);

  return (
    <div className="invoice-view">
      <div>
        <div className="header">
          <div className="title">
            <span>Invoice</span>
          </div>
          <div className="logo-container">
            <img
              src={
                data?.logo
                  ? data.logo
                  : "https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4"
              }
              className="logo"
            />
          </div>
        </div>
        <div className="details-container">
          <div className="details-from">
            <div className="from">From</div>
            <div className="name">{data?.from.name}</div>
            <div className="email">{data?.from.email}</div>
            <div className="phone-number">{data?.from.phoneNumber}</div>
          </div>
          <div className="details-for">
            <div className="for">For</div>
            <div className="name">{data?.to.name}</div>
            <div className="email">{data?.to.email}</div>
            <div className="phone-number">{data?.to.phoneNumber}</div>
          </div>
        </div>
        <div className="invoice-meta">
          <div className="number">Number: {data?.invoice_number}</div>
          <div className="date">Date: {data?.invoice_date}</div>
        </div>
        <div className="invoice-items">
          <Table
            dataSource={data?.items}
            columns={columns}
            pagination={false}
          />
        </div>
        <div className="sub-table">
          <div className="total">
            Total: {data?.currency}{" "}
            {data?.items.reduce((a, b) => {
              return a + b.price * b.quantity;
            }, 0)}
          </div>
        </div>
        <div className="pay-now-link">
          <a href={data?.payment_link} className="pay-now-link">
            Pay Now!
          </a>
        </div>
        <div className="invoice-footer">
          Copy right reserved for company @ payfona.com{" "}
          {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
