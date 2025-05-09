import * as React from "react";
import Table from "antd/es/table";
import Notification from "antd/es/notification";
import type { ColumnsType } from "antd/es/table";
import { useParams } from "react-router-dom";
import { Invoice as InvoiceNetworking } from "../../../networking/invoice";
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
  const [loading, setLoading] = React.useState<boolean>(true);

  const columns: ColumnsType<DataType> = React.useMemo(
    () => [
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        align: "right",
        render: (price) => (
          <span className="invoice-amount">
            {data?.currency} {price.toLocaleString()}
          </span>
        ),
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        align: "center",
      },
      {
        title: "Amount",
        key: "amount",
        align: "right",
        render: (_, record) => (
          <span className="invoice-amount">
            {data?.currency} {(record.price * record.quantity).toLocaleString()}
          </span>
        ),
      },
    ],
    [data?.currency],
  );

  const fetchInvoice = React.useCallback(async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  React.useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const totalAmount = React.useMemo(() => {
    return (
      data?.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ) || 0
    );
  }, [data]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return <div className="invoice-loading">Loading invoice...</div>;
  }

  if (!data) {
    return <div className="invoice-not-found">Invoice not found</div>;
  }

  return (
    <div className="invoice-container">
      <div className="invoice-paper">
        <div className="invoice-header">
          <div className="invoice-title">
            <h1>Invoice</h1>
            <div className="invoice-meta">
              <div className="meta-item">
                <span className="label">Invoice Number:</span>
                <span className="value">{data.invoiceNumber}</span>
              </div>
              <div className="meta-item">
                <span className="label">Date:</span>
                <span className="value">{formatDate(data.invoiceDate)}</span>
              </div>
            </div>
          </div>
          <div className="company-logo">
            <img
              src={
                data.logo ||
                "https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4"
              }
              alt="Company Logo"
            />
          </div>
        </div>

        <div className="invoice-parties">
          <div className="party-box from-box">
            <h3>From</h3>
            <div className="party-details">
              <div className="party-name">{data.from.name}</div>
              <div className="party-contact">
                <div>{data.from.email}</div>
                <div>{data.from.phoneNumber}</div>
              </div>
            </div>
          </div>
          <div className="party-box to-box">
            <h3>To</h3>
            <div className="party-details">
              <div className="party-name">{data.to.name}</div>
              <div className="party-contact">
                <div>{data.to.email}</div>
                <div>{data.to.phoneNumber}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="invoice-items-section">
          <h3>Items</h3>
          <Table
            dataSource={data.items}
            columns={columns}
            pagination={false}
            rowKey="key"
            className="invoice-table"
            rowClassName={(record, index) =>
              index % 2 === 0 ? "even-row" : "odd-row"
            }
          />
        </div>

        <div className="invoice-summary">
          <div className="total-amount">
            <span className="total-label">Total:</span>
            <span className="total-value">
              {data.currency} {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="invoice-actions">
          <a href={data.paymentLink} className="pay-now-button">
            Pay Now
          </a>
        </div>

        <div className="invoice-footer">
          <p>
            Copyright © {new Date().getFullYear()} {data.from.name} ·
            payfona.com
          </p>
        </div>
      </div>
    </div>
  );
}
