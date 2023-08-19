import * as React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Tag, Table } from 'antd/es';
import { useNavigate } from "react-router-dom";
import Notification from "antd/es/notification";
import type { ColumnsType } from 'antd/es/table';
import { LinkOutlined } from '@ant-design/icons';

import Invoices from "../../components/Invoices";

import { Invoice as FetchInvoice } from "../../networking/invoice";

import Template from "../Template";

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

type InvoicesProps = {
  invoices: Invoices[];
};

type InvoiceResponse = {
  success: boolean;
  message: string;
  data: InvoicesProps;
};

type DataType = {
  status: 'PENDING' | 'PAID' | 'DRAFT',
  total: number;
  invoiceNumber: string;
  name: string;
  email: string;
  date: string;
  invoiceId: string;
}

function getColorFromStatus(status: string): string {
  switch(status) {
    case 'PENDING':
      return 'yellow';
    case 'PAID':
      return 'green';
    case 'DRAFT':
      return 'default';
    default:
      return 'default';
  }
}


const columns: ColumnsType<DataType> = [
  {
    title: 'Invoice #',
    dataIndex: 'invoiceNumber',
    key: 'invoiceNumber',
    width: '10%',
  },
  {
    title: 'Customer',
    dataIndex: 'name',
    key: 'name',
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: '30%',
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: '30%',
    render: (value: string) => (
      <Tag color={getColorFromStatus(value)}>{value}</Tag>
    )
  },
  {
    title: 'Preview',
    dataIndex: 'invoiceId',
    key: 'invoiceId',
    width: '30%',
    render: (value) => (
      <div>
        <a href={'/invoice/' + value}>Preview</a>
        <LinkOutlined />
      </div>
    )
  },
];

export default function Invoice() {
  const navigate = useNavigate();
  const [data, setData] = React.useState<Invoices[]>([]);

  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);

  const fetchInvoice = async () => {
    try {
      const response = await FetchInvoice.fetchInvoices(page, limit);
      const data = response.data as InvoiceResponse;
      if (!data.success) {
        Notification.error({
          message: "Something went wrong could not fetch invoices",
        });
      } else {
        setData(data.data.invoices);
      }
    } catch (error) {
      console.error(error);
      Notification.error({
        message: "Something went wrong please try again",
      });
    }
  };
  const handleNewInvoice = () => {
    navigate("/invoice/create");
  };

  React.useEffect(() => {
    fetchInvoice();
  }, [page, limit]);

  return (
    <Template defaultIndex="3">
      <div className="home-container">
        <div className="home-header">
          <div className="header-invoice">
            <div className="header">Invoice</div>
            <div className="header-sub-text">There are 7 total invoices</div>
          </div>
          <div>
            <div className="actions">
              <div className="create-invoice">
                <button
                  className="btn btn-primary add-invoice"
                  onClick={handleNewInvoice}
                >
                  <PlusOutlined />
                  <div className="add-invoice-text">New Invoice</div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <Table columns={columns} dataSource={data} />
      </div>
    </Template>
  );
}
