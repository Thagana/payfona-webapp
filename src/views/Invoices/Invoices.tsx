import * as React from "react";
import { Tag, Table, Button, Checkbox, Card, Space, Typography } from "antd/es";
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
import { columns } from "./data/columns";
import { TableRowSelection } from "antd/es/table/interface";
import Input, { SearchProps } from "antd/es/input";

export default function Invoice() {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);
  const [searchTerm, setSearchTerm] = React.useState<string>("");

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

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  };

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
