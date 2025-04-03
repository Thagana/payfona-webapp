import * as React from "react";
import Table from "antd/es/table";
import Notification from 'antd/es/notification';
import type { ColumnsType } from "antd/es/table";
import { useParams } from "react-router-dom";
import "./Invoice.scss";
import { Invoice as InvoiceNetworking } from '../../../networking/invoice';

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
  invoiceNumber: string;
  invoiceDate: string;
  paymentLink: string;
  logo: string;
  items: DataType[];
  currency: "ZAR" | "USD";
}

export default function Invoice() {
  const { invoiceId } = useParams();
  const [data, setData] = React.useState<Invoice | null>(null);

  const columns: ColumnsType<DataType> = React.useMemo(() => [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span>{price}</span>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => <span>{record.price * record.quantity}</span>,
    },
  ], []);

  const fetchInvoice = React.useCallback(async () => {
    try {
      const response = await InvoiceNetworking.fetchInvoice(invoiceId || '');
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
        message: 'Failed to find invoice',
      });
    }
  }, [invoiceId]);

  React.useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const totalAmount = React.useMemo(() => {
    return data?.items.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
  }, [data]);

  return (
    <div className="invoice-view">
      <div>
        <div className="header">
          <div className="title">
            <span>Invoice</span>
          </div>
          <div className="logo-container">
            <img
              src={data?.logo || "https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4"}
              className="logo"
              alt="Company Logo"
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
          <div className="number">Number: {data?.invoiceNumber}</div>
          <div className="date">Date: {data?.invoiceDate}</div>
        </div>
        <div className="invoice-items">
          <Table dataSource={data?.items} columns={columns} pagination={false} rowKey="key" />
        </div>
        <div className="sub-table">
          <div className="total">
            Total: {data?.currency} {totalAmount}
          </div>
        </div>
        <div className="pay-now-link">
          <a href={data?.paymentLink} className="pay-now-link">Pay Now!</a>
        </div>
        <div className="invoice-footer">
          Copyright reserved for company @ payfona.com {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
