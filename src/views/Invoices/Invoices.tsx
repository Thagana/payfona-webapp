import * as React from "react";
import {
  Tag,
  Table,
  Divider,
  Button,
  Drawer,
  Checkbox,
  notification,
} from "antd/es";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ExportToCsv } from "export-to-csv";
import {
  DownloadOutlined,
  PlusOutlined,
  UserOutlined,
  EyeOutlined,
  RollbackOutlined,
} from "@ant-design/icons";

import Axios from "../../networking/adaptor";

import "./Invoices.scss";

import { useQuery } from "@tanstack/react-query";
import { InvoiceType } from "./interface/Invoice";
import { columns } from "./data/columns";
import { TableRowSelection } from "antd/es/table/interface";

export default function Invoice() {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [isOpenInvoiceDetails, setIsOpenInvoiceDetails] = React.useState(false);
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);

  const { data, isLoading } = useQuery<{
    data: {
      data: {
        invoices: InvoiceType[];
      };
    };
  }>({
    queryKey: ["invoices"],
    queryFn: async () => {
      return Axios.get(`/invoice?page=${page}&limit=${limit}`);
    },
  });

  const handleSelect = React.useCallback(
    (record: InvoiceType, selected: boolean) => {
      setSelectedRowKeys((keys) =>
        selected
          ? [...keys, record.invoiceId]
          : keys.filter((key) => key !== record.invoiceId),
      );
    },
    [],
  );

  const toggleSelectAll = React.useCallback(() => {
    if (data) {
      setSelectedRowKeys((keys) =>
        keys.length === data.data.data.invoices.length
          ? []
          : data.data.data.invoices.map((r) => r.invoiceId),
      );
    }
  }, [data]);

  const headerCheckbox = React.useMemo(
    () => (
      <Checkbox
        checked={selectedRowKeys.length > 0}
        indeterminate={
          selectedRowKeys.length > 0 &&
          selectedRowKeys.length < (data ? data.data.data.invoices.length : 0)
        }
        onChange={toggleSelectAll}
      />
    ),
    [selectedRowKeys, data?.data.data.invoices?.length, toggleSelectAll],
  );

  const rowSelection: TableRowSelection<InvoiceType> = {
    selectedRowKeys,
    type: "checkbox",
    fixed: true,
    onSelect: handleSelect,
    columnTitle: headerCheckbox,
    onSelectAll: toggleSelectAll,
  };

  const onClose = React.useCallback(() => {
    setIsOpenInvoiceDetails(!isOpenInvoiceDetails);
  }, [isOpenInvoiceDetails]);

  const handleNewInvoice = React.useCallback(() => {
    navigate("/invoice/create");
  }, [navigate]);

  const handleViewInvoice = React.useCallback(
    (id: string | undefined) => {
      if (id) {
        navigate(`/invoice/${id}`);
      }
    },
    [navigate],
  );

  const handleExport = React.useCallback(() => {
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      title: `Invoice_Report`,
      showTitle: true,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename: `Invoice_Report-${new Date().getTime()}`,
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data);
  }, [data]);

  const downloadInvoice = React.useCallback(() => {
    // download invoice
  }, []);

  const statusFormatter = React.useCallback(
    (date?: string, status?: "PAID" | "DRAFT" | "PENDING", paidAt?: string) => {
      switch (status) {
        case "PAID":
          return (
            <Tag color="green">
              PAID on {format(new Date(paidAt || "2008/06/06"), "y/M/d")}
            </Tag>
          );
        case "DRAFT":
          return (
            <Tag color="default">
              DRAFT {format(new Date(date || ""), "y/M/d")}
            </Tag>
          );
        case "PENDING":
          return (
            <Tag color="red">
              OVERDUE {format(new Date(date || ""), "y/M/d")}
            </Tag>
          );
        default:
          return <></>;
      }
    },
    [],
  );

  return (
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
        columns={columns}
        rowKey={(record) => record.invoiceId}
        dataSource={data?.data.data.invoices}
        loading={isLoading}
      />
    </div>
  );
}
