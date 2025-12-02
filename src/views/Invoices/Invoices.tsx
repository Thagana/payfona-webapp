import * as React from "react";
import {
  Tag,
  Table,
  Button,
  Checkbox,
  Card,
  Space,
  Typography,
  Input,
} from "antd/es";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ExportToCsv } from "export-to-csv";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";

import Axios from "../../networking/adaptor";

const { Search } = Input;
const { Title } = Typography;

import "./Invoices.scss";

import { useQuery } from "@tanstack/react-query";
import { InvoiceType } from "./interface/Invoice";
import { TableRowSelection } from "antd/es/table/interface";
import type { SearchProps } from "antd/es/input";
import type { ColumnsType } from "antd/es/table";

export default function Invoice() {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();

  const { data, isLoading } = useQuery<{
    data: {
      data: {
        invoices: InvoiceType[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
    };
  }>({
    queryKey: ["invoices", page, limit, searchTerm],
    queryFn: async () => {
      return Axios.get(
        `/invoice?page=${page}&limit=${limit}&search=${searchTerm}`,
      );
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

  const handlePageChange = React.useCallback(
    (newPage: number, newPageSize?: number) => {
      setPage(newPage);
      if (newPageSize && newPageSize !== limit) {
        setLimit(newPageSize);
      }
    },
    [limit],
  );

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

  const handleNewInvoice = React.useCallback(() => {
    navigate("/invoice/create");
  }, [navigate]);

  const handleExport = React.useCallback(() => {
    if (!data?.data.data.invoices) return;

    const exportData = data.data.data.invoices
      .filter((invoice) => selectedRowKeys.includes(invoice.invoiceId))
      .map((invoice) => ({
        "Invoice Number": invoice.invoiceNumber,
        "Customer Name": invoice.name,
        Email: invoice.email,
        Status: invoice.status,
        Total: `${invoice.currency} ${(invoice.total / 100).toFixed(2)}`,
        Date: format(new Date(invoice.date), "yyyy-MM-dd"),
        "Paid At": invoice.paidAt
          ? format(new Date(invoice.paidAt), "yyyy-MM-dd")
          : "N/A",
      }));

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
    csvExporter.generateCsv(exportData);
  }, [data, selectedRowKeys]);

  const statusFormatter = React.useCallback(
    (date?: string, status?: "PAID" | "DRAFT" | "PENDING", paidAt?: string) => {
      switch (status) {
        case "PAID":
          return (
            <Tag color="green">
              PAID on {format(new Date(paidAt || ""), "yyyy/MM/dd")}
            </Tag>
          );
        case "DRAFT":
          return (
            <Tag color="default">
              DRAFT {format(new Date(date || ""), "yyyy/MM/dd")}
            </Tag>
          );
        case "PENDING":
          return (
            <Tag color="orange">
              PENDING {format(new Date(date || ""), "yyyy/MM/dd")}
            </Tag>
          );
        default:
          return <Tag>UNKNOWN</Tag>;
      }
    },
    [],
  );

  const handleViewInvoice = React.useCallback(
    (invoiceId: string) => {
      navigate(`/invoice/${invoiceId}`);
    },
    [navigate],
  );

  const columns: ColumnsType<InvoiceType> = React.useMemo(
    () => [
      {
        title: "Invoice #",
        dataIndex: "invoiceNumber",
        key: "invoiceNumber",
        width: 120,
        fixed: "left",
        render: (text: string, record: InvoiceType) => (
          <Button
            type="link"
            onClick={() => handleViewInvoice(record.invoiceId)}
            style={{ padding: 0 }}
          >
            {text}
          </Button>
        ),
      },
      {
        title: "Customer",
        dataIndex: "name",
        key: "name",
        width: 180,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 200,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 180,
        render: (status: string, record: InvoiceType) =>
          statusFormatter(
            record.date,
            status as "PAID" | "DRAFT" | "PENDING",
            record.paidAt,
          ),
      },
      {
        title: "Amount",
        dataIndex: "total",
        key: "total",
        width: 150,
        align: "right",
        render: (total: number, record: InvoiceType) => (
          <strong>
            {record.currency} {(total / 100).toFixed(2)}
          </strong>
        ),
        sorter: (a, b) => a.total - b.total,
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: 120,
        render: (date: string) => format(new Date(date), "yyyy-MM-dd"),
        sorter: (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime(),
      },
      {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 120,
        render: (date: string) => format(new Date(date), "yyyy-MM-dd"),
        sorter: (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      },
    ],
    [statusFormatter, handleViewInvoice],
  );

  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search to avoid excessive API calls
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
      setPage(1);
    }, 500);
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="invoices-container">
      <Card className="invoices-header-card" bordered={false}>
        <div className="invoices-header">
          <div className="header-left">
            <Title level={2} className="page-title">
              Invoices
            </Title>
            <div className="search-section">
              <Search
                placeholder="Search invoices by number, customer, or email"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
                onChange={handleSearchChange}
                className="invoice-search"
              />
            </div>
          </div>
          <div className="header-right">
            <Space size="middle" className="actions">
              <Button
                className="btn-export"
                onClick={handleExport}
                icon={<DownloadOutlined />}
                disabled={selectedRowKeys.length === 0}
              >
                Export ({selectedRowKeys.length})
              </Button>
              <Button
                type="primary"
                className="btn-new-invoice"
                onClick={handleNewInvoice}
                icon={<PlusOutlined />}
              >
                New Invoice
              </Button>
            </Space>
          </div>
        </div>
      </Card>

      <Card className="invoices-table-card" bordered={false}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          rowKey={(record) => record.invoiceId}
          dataSource={data?.data.data.invoices}
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.data.data.totalItems || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} invoices`,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
          }}
          scroll={{ x: 800 }}
          className="invoices-table"
        />
      </Card>
    </div>
  );
}
