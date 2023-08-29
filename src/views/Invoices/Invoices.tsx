import * as React from "react";
import { Tag, Table, Divider, Button } from 'antd/es';
import { useNavigate } from "react-router-dom";
import Notification from "antd/es/notification";
import { format } from "date-fns";
import { ExportToCsv } from 'export-to-csv';

import Drawer from 'antd/es/drawer';
import Checkbox from "antd/es/checkbox/Checkbox";

import { LinkOutlined, DownloadOutlined, PlusOutlined, UserOutlined, EyeOutlined, RollbackOutlined } from '@ant-design/icons';

import { TableRowSelection } from "antd/es/table/interface";
import type { ColumnsType } from 'antd/es/table';

import { Invoice as FetchInvoice } from "../../networking/invoice";

import Template from "../Template";


import "./Invoices.scss";


type Invoice = {
  id: number;
  status: "PENDING" | "PAID" | "DRAFT";
  total: number;
  invoiceNumber: string;
  name: string;
  email: string;
  date: string;
  invoiceId: string;
  currency: string
  createdAt: string
  paidAt: string;
  banking: {
    channel: string;
    brand: string;
    last4: string;
    bank: string
  }
};

type InvoicesProps = {
  invoices: Invoice[];
};

type InvoiceResponse = {
  success: boolean;
  message: string;
  data: InvoicesProps;
};

function getColorFromStatus(status: string): string {
  switch (status) {
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

const columns: ColumnsType<Invoice> = [
  {
    title: 'Invoice #',
    dataIndex: 'invoiceNumber',
    key: 'invoiceNumber',
    width: '10%',
  },
  {
    title: 'Customer',
    dataIndex: 'name',
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: '20%',
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: '20%',
    render: (value: string) => (
      <Tag color={getColorFromStatus(value)}>{value}</Tag>
    )
  },
  {
    title: 'Amount',
    dataIndex: 'total',
    key: 'total',
    width: '20%',
    render: (value, record) => (
      <span className="total">{record.currency} {value / 100}</span>
    )
  },
  {
    title: 'Preview',
    dataIndex: 'invoiceId',
    key: 'invoiceId',
    width: '10%',
    render: (value) => (
      <div>
        <a href={'/invoice/' + value}>Preview</a>
        <LinkOutlined />
      </div>
    )
  }
];

export default function Invoice() {
  const navigate = useNavigate();
  const [data, setData] = React.useState<Invoice[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [isOpenInvoiceDetails, setIsOpenInvoiceDetails] = React.useState(false);
  const [selectedRecord, setSelectedInvoice] = React.useState<Invoice>();
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);

  const handleSelect = (record: Invoice, selected: boolean) => {
    if (selected) {
      setSelectedRowKeys((keys) => [...keys, record.invoiceId]);
    } else {
      setSelectedRowKeys((keys) => {
        const index = keys.indexOf(record.invoiceId);
        return [...keys.slice(0, index), ...keys.slice(index + 1)];
      });
    }
  };

  const toggleSelectAll = () => {
    setSelectedRowKeys((keys) =>
      keys.length === data.length ? [] : data.map((r) => r.invoiceId)
    );
  };

  const headerCheckbox = (
    <Checkbox
      checked={selectedRowKeys.length === 0 ? false : true}
      indeterminate={
        selectedRowKeys.length > 0 && selectedRowKeys.length < data.length
      }
      onChange={toggleSelectAll}
    />
  );

  const rowSelection: TableRowSelection<Invoice> = {
    selectedRowKeys,
    type: "checkbox",
    fixed: true,
    onSelect: handleSelect,
    columnTitle: headerCheckbox,
    onSelectAll: toggleSelectAll
  };

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

  const onClose = () => {
    setIsOpenInvoiceDetails(!isOpenInvoiceDetails);
  }

  const handleNewInvoice = () => {
    navigate("/invoice/create");
  };

  const handleViewInvoice = (id: string | undefined) => {
    if (id) {
      navigate(`/invoice/${id}`);
    }
  }

  const handleExport = () => {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      title: `Invoice_Report`,
      showTitle: true,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename: `Invoice_Report-${new Date().getTime()}`
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data);
  }

  const exportSingleInvoice = (payload: any) => {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      title: `Invoice_Report`,
      showLabels: true,
      showTitle: true,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename: `Invoice_Report-${new Date().getTime()}`
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv([payload]);
  }

  const downloadInvoice = () => {
    
  }

  const statusFormatter = (date?: string, status?: 'PAID' | 'DRAFT' | 'PENDING', paidAt?: string) => {
    switch (status) {
      case 'PAID':
        return <Tag color="green">PAID on {format(new Date(paidAt || '2008/06/06'), 'y/M/d')}</Tag>
        break;
      case 'DRAFT':
        return <Tag color="default">DRAFT {format(new Date(date || ''), 'y/M/d')}</Tag>
      case 'PENDING':
        return <Tag color="red">OVERDUE {format(new Date(date || ''), 'y/M/d')}</Tag>
      default:
        return <></>
    }
  }

  React.useEffect(() => {
    fetchInvoice();
  }, [page, limit]);

  return (
    <Template defaultIndex="3">
      <div className="home-container">
        <div className="home-header">
          <div className="header-invoice">
            <div className="header">Invoice</div>
          </div>
          <div>
            <div className="actions">
              <div className="create-invoice">
                <button
                  className="btn btn-primary btn-outlined add-invoice"
                  onClick={handleExport}
                >
                  <DownloadOutlined />
                  <div className="add-invoice-text">Export</div>
                </button>
              </div>
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
        <Table
          rowSelection={rowSelection}
          onRow={(record, rowIndex) => {
            return {
              onClick: event => {
                setIsOpenInvoiceDetails(!isOpenInvoiceDetails);
                setSelectedInvoice(record);
              }
            }
          }}
          columns={columns}
          rowKey={(record) => record.invoiceId}
          dataSource={data}
        />
        <Drawer
          title={`Invoice ${selectedRecord?.invoiceNumber}`}
          placement="right"
          onClose={onClose}
          open={isOpenInvoiceDetails} className="invoice-drawer">
          <div className="invoice-details">
            <div className="row-item">
              <span>
                <UserOutlined />
              </span>
              <span>
                {selectedRecord?.name}
              </span>
            </div>
            <div className="row-item">
              <span>Amount Due</span>
              <span>{selectedRecord?.currency} {selectedRecord?.total}</span>
            </div>
            <div className="row-item">
              <span>Invoice Created</span>
              <span>{format(new Date(selectedRecord?.createdAt || '2008/06/06'), 'y/M/d')}</span>
            </div>
            <div className="row-item">
              <span>Invoice Due</span>
              <span>{format(new Date(selectedRecord?.date || '2008/06/06'), 'y/M/d')}</span>
            </div>
            <div className="row-item">
              <span>Status</span>
              <span>
                {statusFormatter(selectedRecord?.date, selectedRecord?.status, selectedRecord?.paidAt)}
              </span>
            </div>
            <div className="row-item">
              <span>Method</span>
              <span>
                {selectedRecord?.banking.channel} {selectedRecord?.banking.brand} ********{selectedRecord?.banking.last4}
              </span>
            </div>
            <Divider />
            <div className="row-item">
              <span>
                <Button>
                  <RollbackOutlined />
                </Button>
              </span>
              <span className="buttons-inline">
                <Button onClick={() => {
                  handleViewInvoice(selectedRecord?.invoiceId)
                }}>
                  <EyeOutlined />
                </Button>
                <Button onClick={() => {
                  exportSingleInvoice(selectedRecord);
                }}>
                  <DownloadOutlined />
                </Button>
              </span>
            </div>
            <Divider />
          </div>
        </Drawer>
      </div>
    </Template>
  );
}
