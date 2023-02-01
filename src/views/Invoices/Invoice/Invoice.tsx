import * as React from "react";
import { useParams } from "react-router-dom";
import Notification from "antd/es/notification";
import { Invoice as InvoiceAdaptor } from "../../../networking/invoice";
import { motion } from "framer-motion";
import { LeftOutlined } from "@ant-design/icons";
import Table from "antd/es/table";
import { formatInTimeZone } from 'date-fns-tz'
import { parseISO } from 'date-fns';

import type { ColumnsType } from "antd/es/table";

import "./Invoice.scss";

import TemplateWrapper from "../../Template";
import InvoiceStatus from "../../../components/InvoiceStatus";

interface DataType {
  key: string;
  description: string;
  qty: number;
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
  payment_link: string;
  status?: "PAID" | "DRAFT" | "PENDING";
  items: {
    key: string;
    description: string;
    qty: number;
    price: number;
    amount: number;
  }[];
}

type VIEW_SERVER_STATE = "IDLE" | "LOADING" | "ERROR" | "SUCCESS";

export default function Invoice() {
  let { invoiceId } = useParams();
  const [invoiceMeta, setInvoiceMeta] = React.useState<Invoice>();
  const [SERVER_STATES, setServerState] =
    React.useState<VIEW_SERVER_STATE>("IDLE");

  const fetchInvoice = React.useCallback(async () => {
    try {
      if (!invoiceId) {
        return;
      }
      setServerState('LOADING');
      const response = await InvoiceAdaptor.fetchInvoice(invoiceId);
      if (!response.data.success) {
        Notification.error({
          message: "Something went, could not connect",
        });
        setServerState('ERROR');
      } else {
        setInvoiceMeta(response.data.data.data);
        setServerState('SUCCESS');
      }
    } catch (error) {
      setServerState('ERROR');
      Notification.error({
        message: "Something went wrong please try again later",
      });
    }
  }, [invoiceId]);

  const invoiceDateTime = (date: string | undefined) => {
    if (date) {
      const parsed = parseISO(date);
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return formatInTimeZone(parsed, timeZone, 'dd MMM yyyy')
    }
  };

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
      render: (_, record) => <span>${record.price}</span>,
    },
    {
      title: "qty",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => <span>${record.amount}</span>,
    },
  ];

  React.useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  return (
    <TemplateWrapper defaultIndex="2">
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="invoice-detail-container"
      >
        <div className="invoice-details">
          <a href="/invoices" className="back-link">
            <LeftOutlined color="#000"/> Go BACK
          </a>
          {SERVER_STATES === 'ERROR' && (
            <div className="error">
              Error occurred
            </div>
          )}
          {SERVER_STATES === 'LOADING' && (
            <div className="loading">
              Loading ...
            </div>
          )}
          <div className="invoice-view">
            {SERVER_STATES === "SUCCESS" && (
              <>
                <div className="invoice-header">
                  <div className="status">
                    <span className="status-text">Status</span>
                    <InvoiceStatus
                      status={
                        invoiceMeta?.status || 'DRAFT'
                      }
                    />
                  </div>
                  <div className="controls">
                    <button className="edit" disabled>
                      Edit
                    </button>
                    <button className="delete">Delete</button>
                  </div>
                </div>
                <div>
                  <div className="header">
                    <div className="title">
                      <span>Invoice</span>
                    </div>
                    <div className="logo-container">
                      <img
                        src="https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4"
                        className="logo"
                      />
                    </div>
                  </div>
                  <div className="details-container">
                    <div className="details-from">
                      <div className="from">From</div>
                      <div className="name">{invoiceMeta?.from.name}</div>
                      <div className="email">{invoiceMeta?.from.email}</div>
                      <div className="phone-number">
                        {invoiceMeta?.from.phoneNumber}
                      </div>
                    </div>
                    <div className="details-for">
                      <div className="for">For</div>
                      <div className="name">{invoiceMeta?.to.name}</div>
                      <div className="email">{invoiceMeta?.to.email}</div>
                      <div className="phone-number">
                        {invoiceMeta?.to.phoneNumber}
                      </div>
                    </div>
                  </div>
                  <div className="invoice-meta">
                    <div className="number">
                      Number: {invoiceMeta?.invoiceNumber}
                    </div>
                    <div className="date">
                      Date: {invoiceDateTime(invoiceMeta?.invoiceDate)}
                    </div>
                  </div>
                  <div className="invoice-items">
                    <Table
                      dataSource={invoiceMeta?.items}
                      columns={columns}
                      pagination={false}
                    />
                  </div>
                  <div className="sub-table">
                    <div className="total">
                      Total: $
                      {invoiceMeta?.items.reduce((a, b) => {
                        return a + b.amount;
                      }, 0)}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </TemplateWrapper>
  );
}
