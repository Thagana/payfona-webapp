import React from "react";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, Table, Tag, Typography, Space } from "antd";
import { useQuery } from "@tanstack/react-query";
import { SearchProps } from "antd/es/input";
import { TableRowSelection } from "antd/es/table/interface";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ExportToCsv } from "export-to-csv";
import Axios from "../../networking/adaptor";
import { TransactionType } from "./interfaces/transactions.interface";

const { Search } = Input;
const { Text } = Typography;

export default function Transactions() {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const navigate = useNavigate();
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();

  const { data, error, isError, isLoading } = useQuery<{
    data: TransactionType[];
    totalItems?: number;
    totalPages?: number;
  }>({
    queryKey: ["transactions", page, limit, searchTerm],
    queryFn: async () => {
      return Axios.get(
        `/transactions?page=${page}&limit=${limit}&search=${searchTerm}`,
      );
    },
  });

  const toggleSelectAll = React.useCallback(() => {
    if (data) {
      setSelectedRowKeys((keys) =>
        keys.length === data.data.length ? [] : data.data.map((r) => r.id),
      );
    }
  }, [data]);

  const handleSelect = React.useCallback(
    (record: TransactionType, selected: boolean) => {
      setSelectedRowKeys((keys) =>
        selected
          ? [...keys, record.id]
          : keys.filter((key) => key !== record.id),
      );
    },
    [],
  );

  const headerCheckbox = React.useMemo(
    () => (
      <Checkbox
        checked={selectedRowKeys.length > 0}
        indeterminate={
          selectedRowKeys.length > 0 &&
          selectedRowKeys.length < (data ? data.data.length : 0)
        }
        onChange={toggleSelectAll}
      />
    ),
    [selectedRowKeys, data?.data.length, toggleSelectAll],
  );

  const rowSelection: TableRowSelection<TransactionType> = {
    selectedRowKeys,
    type: "checkbox",
    fixed: true,
    onSelect: handleSelect,
    columnTitle: headerCheckbox,
    onSelectAll: toggleSelectAll,
  };

  const getTransactionType = (metadata: any): string => {
    if (metadata?.type === "SUBSCRIPTION") return "SUBSCRIPTION";
    if (metadata?.type === "INVOICE") return "INVOICE";
    if (metadata?.plan) return "SUBSCRIPTION";
    if (metadata?.payee || metadata?.payer) return "INVOICE";
    return "OTHER";
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case "SUBSCRIPTION":
        return "blue";
      case "INVOICE":
        return "green";
      default:
        return "default";
    }
  };

  const getStatusColor = (status?: string): string => {
    switch (status?.toLowerCase()) {
      case "success":
        return "green";
      case "pending":
        return "orange";
      case "failed":
        return "red";
      default:
        return "default";
    }
  };

  const handleExport = React.useCallback(() => {
    if (!data?.data) return;

    const exportData = data.data
      .filter((transaction) => selectedRowKeys.includes(transaction.id))
      .map((transaction) => {
        const type = getTransactionType(transaction.metadata);
        const isSubscription = type === "SUBSCRIPTION";
        const isInvoice = type === "INVOICE";

        return {
          ID: transaction.id,
          Type: type,
          "Customer/Payer": isSubscription
            ? `${transaction.metadata?.customer?.first_name} ${transaction.metadata?.customer?.last_name}`
            : isInvoice
              ? `${transaction.metadata?.payer?.firstName} ${transaction.metadata?.payer?.lastName}`
              : "N/A",
          Email: isSubscription
            ? transaction.metadata?.customer?.email
            : isInvoice
              ? transaction.metadata?.payer?.email
              : "N/A",
          "Plan/Reference": isSubscription
            ? transaction.metadata?.plan?.name
            : isInvoice
              ? transaction.metadata?.invoiceGuid
              : "N/A",
          Amount: isSubscription
            ? `${transaction.metadata?.currency} ${(transaction.metadata?.amount / 100).toFixed(2)}`
            : "N/A",
          Status: transaction.metadata?.status || "N/A",
          "Payment Method": transaction.metadata?.channel || "N/A",
          Date: format(new Date(transaction.created_at), "yyyy-MM-dd HH:mm"),
        };
      });

    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      title: "Transaction_Report",
      showTitle: true,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename: `Transaction_Report-${new Date().getTime()}`,
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(exportData);
  }, [data, selectedRowKeys]);

  const columns: ColumnsType<TransactionType> = React.useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 80,
        fixed: "left",
        render: (id: number) => <Text strong>#{id}</Text>,
      },
      {
        title: "Type",
        key: "type",
        width: 130,
        render: (_, record: TransactionType) => {
          const type = getTransactionType(record.metadata);
          return <Tag color={getTypeColor(type)}>{type}</Tag>;
        },
        filters: [
          { text: "Subscription", value: "SUBSCRIPTION" },
          { text: "Invoice", value: "INVOICE" },
          { text: "Other", value: "OTHER" },
        ],
        onFilter: (value, record) =>
          getTransactionType(record.metadata) === value,
      },
      {
        title: "Customer/Payer",
        key: "customer",
        width: 200,
        render: (_, record: TransactionType) => {
          const type = getTransactionType(record.metadata);

          if (type === "SUBSCRIPTION" && record.metadata?.customer) {
            const customer = record.metadata.customer;
            return (
              <div>
                <div>
                  <Text strong>
                    {customer.first_name} {customer.last_name}
                  </Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {customer.email}
                  </Text>
                </div>
              </div>
            );
          }

          if (type === "INVOICE" && record.metadata?.payer) {
            const payer = record.metadata.payer;
            return (
              <div>
                <div>
                  <Text strong>
                    {payer.firstName} {payer.lastName}
                  </Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {payer.email}
                  </Text>
                </div>
              </div>
            );
          }

          return <Text type="secondary">N/A</Text>;
        },
      },
      {
        title: "Plan/Invoice",
        key: "details",
        width: 180,
        render: (_, record: TransactionType) => {
          const type = getTransactionType(record.metadata);

          if (type === "SUBSCRIPTION" && record.metadata?.plan) {
            const plan = record.metadata.plan;
            return (
              <div>
                <div>
                  <Text strong>{plan.name}</Text>
                </div>
                <div>
                  <Tag color="blue" style={{ fontSize: "11px" }}>
                    {plan.interval}
                  </Tag>
                </div>
              </div>
            );
          }

          if (type === "INVOICE" && record.metadata?.invoiceGuid) {
            return (
              <Text code copyable style={{ fontSize: "11px" }}>
                {record.metadata.invoiceGuid}
              </Text>
            );
          }

          return <Text type="secondary">N/A</Text>;
        },
      },
      {
        title: "Amount",
        key: "amount",
        width: 120,
        align: "right",
        render: (_, record: TransactionType) => {
          if (record.metadata?.amount && record.metadata?.currency) {
            return (
              <Text strong>
                {record.metadata.currency}{" "}
                {(record.metadata.amount / 100).toFixed(2)}
              </Text>
            );
          }
          return <Text type="secondary">N/A</Text>;
        },
        sorter: (a, b) => {
          const amountA = a.metadata?.amount || 0;
          const amountB = b.metadata?.amount || 0;
          return amountA - amountB;
        },
      },
      {
        title: "Status",
        key: "status",
        width: 120,
        render: (_, record: TransactionType) => {
          const status = record.metadata?.status;
          if (status) {
            return (
              <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
            );
          }
          return <Text type="secondary">N/A</Text>;
        },
        filters: [
          { text: "Success", value: "success" },
          { text: "Pending", value: "pending" },
          { text: "Failed", value: "failed" },
        ],
        onFilter: (value, record) => record.metadata?.status === value,
      },
      {
        title: "Payment Method",
        key: "channel",
        width: 130,
        render: (_, record: TransactionType) => {
          const channel = record.metadata?.channel;
          const authorization = record.metadata?.authorization;

          if (channel === "card" && authorization) {
            return (
              <div>
                <div>
                  <Tag color="purple">
                    {authorization.brand?.toUpperCase()} ••••{" "}
                    {authorization.last4}
                  </Tag>
                </div>
              </div>
            );
          }

          if (channel) {
            return <Tag>{channel.toUpperCase()}</Tag>;
          }

          return <Text type="secondary">N/A</Text>;
        },
      },
      {
        title: "Reference",
        key: "reference",
        width: 120,
        render: (_, record: TransactionType) => {
          const reference = record.metadata?.reference;
          if (reference) {
            return (
              <Text code style={{ fontSize: "11px" }}>
                {reference}
              </Text>
            );
          }
          return <Text type="secondary">N/A</Text>;
        },
      },
      {
        title: "Date",
        dataIndex: "created_at",
        key: "created_at",
        width: 150,
        render: (date: string) => (
          <div>
            <div>{format(new Date(date), "yyyy-MM-dd")}</div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {format(new Date(date), "HH:mm:ss")}
            </Text>
          </div>
        ),
        sorter: (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      },
    ],
    [],
  );

  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
      setPage(1);
    }, 500);
  };

  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      {/* Fixed Header Layout */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1", minWidth: "300px", maxWidth: "600px" }}>
          <Search
            placeholder="Search by customer name, email, reference, or plan"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
            onChange={handleSearchChange}
          />
        </div>
        <div>
          <Button
            size="large"
            onClick={handleExport}
            disabled={selectedRowKeys.length === 0}
            icon={<DownloadOutlined />}
          >
            Export Report ({selectedRowKeys.length})
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div style={{ background: "#fff", borderRadius: "8px", padding: "24px" }}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={data?.data}
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.totalItems || data?.data?.length || 0,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              if (newPageSize !== limit) {
                setLimit(newPageSize);
              }
            },
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} transactions`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          scroll={{ x: 1400 }}
        />
      </div>
    </div>
  );
}
