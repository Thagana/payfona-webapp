import React from "react";
import { PlusOutlined, SolutionOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, Table, Tag, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { SearchProps } from "antd/es/input";
import { TableRowSelection } from "antd/es/table/interface";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Axios from "../../../networking/adaptor";
import { SubscriptionType } from "../interface/subscription.interface";

const { Search } = Input;
const { Text } = Typography;

export function AllSubscriptions() {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const navigate = useNavigate();
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();

  const { data, error, isError, isLoading } = useQuery<{
    data: {
      data: SubscriptionType[];
      totalItems?: number;
      totalPages?: number;
    };
  }>({
    queryKey: ["subscriptions", page, limit, searchTerm],
    queryFn: async () => {
      return Axios.get(
        `/subscriptions?page=${page}&limit=${limit}&search=${searchTerm}`,
      );
    },
  });

  const toggleSelectAll = React.useCallback(() => {
    if (data) {
      setSelectedRowKeys((keys) =>
        keys.length === data.data.data.length
          ? []
          : data.data.data.map((r) => r.id),
      );
    }
  }, [data]);

  const handleSelect = React.useCallback(
    (record: SubscriptionType, selected: boolean) => {
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
          selectedRowKeys.length < (data ? data.data.data.length : 0)
        }
        onChange={toggleSelectAll}
      />
    ),
    [selectedRowKeys, data?.data.data?.length, toggleSelectAll],
  );

  const rowSelection: TableRowSelection<SubscriptionType> = {
    selectedRowKeys,
    type: "checkbox",
    fixed: true,
    onSelect: handleSelect,
    columnTitle: headerCheckbox,
    onSelectAll: toggleSelectAll,
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "active":
        return "green";
      case "pending":
        return "orange";
      case "failed":
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getFrequencyLabel = (cronExpression: string) => {
    switch (cronExpression?.toLowerCase()) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      default:
        return cronExpression || "N/A";
    }
  };

  const columns: ColumnsType<SubscriptionType> = React.useMemo(
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
        title: "Customer",
        key: "customer",
        width: 200,
        render: (_, record: SubscriptionType) => {
          const customer = record.metadata?.customer;
          if (customer) {
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
          return <Text type="secondary">N/A</Text>;
        },
      },
      {
        title: "Plan",
        key: "plan",
        width: 180,
        render: (_, record: SubscriptionType) => {
          const plan = record.metadata?.plan;
          if (plan) {
            return (
              <div>
                <div>
                  <Text strong>{plan.name}</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {plan.plan_code}
                  </Text>
                </div>
              </div>
            );
          }
          return <Text type="secondary">N/A</Text>;
        },
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        width: 120,
        align: "right",
        render: (amount: number, record: SubscriptionType) => {
          const currency = record.metadata?.currency || "ZAR";
          return (
            <Text strong>
              {currency} {(amount / 100).toFixed(2)}
            </Text>
          );
        },
        sorter: (a, b) => a.amount - b.amount,
      },
      {
        title: "Frequency",
        dataIndex: "cronExpression",
        key: "cronExpression",
        width: 120,
        render: (cronExpression: string) => (
          <Tag color="blue">{getFrequencyLabel(cronExpression)}</Tag>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (status: string) => (
          <Tag color={getStatusColor(status)}>
            {status?.toUpperCase() || "UNKNOWN"}
          </Tag>
        ),
        filters: [
          { text: "Success", value: "success" },
          { text: "Active", value: "active" },
          { text: "Pending", value: "pending" },
          { text: "Failed", value: "failed" },
          { text: "Cancelled", value: "cancelled" },
        ],
        onFilter: (value, record) => record.status === value,
      },
      {
        title: "Source",
        dataIndex: "source",
        key: "source",
        width: 120,
        render: (source: string) => <Tag color="purple">{source || "N/A"}</Tag>,
      },
      {
        title: "Last Payment",
        key: "paidAt",
        width: 150,
        render: (_, record: SubscriptionType) => {
          const paidAt = record.metadata?.paidAt || record.metadata?.paid_at;
          if (paidAt) {
            return (
              <div>
                <div>{format(new Date(paidAt), "yyyy-MM-dd")}</div>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {format(new Date(paidAt), "HH:mm")}
                </Text>
              </div>
            );
          }
          return <Text type="secondary">N/A</Text>;
        },
        sorter: (a, b) => {
          const dateA = a.metadata?.paidAt || a.metadata?.paid_at;
          const dateB = b.metadata?.paidAt || b.metadata?.paid_at;
          if (!dateA) return 1;
          if (!dateB) return -1;
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        },
      },
      {
        title: "Customer ID",
        dataIndex: "customerId",
        key: "customerId",
        width: 180,
        render: (customerId: string) => (
          <Text code copyable style={{ fontSize: "12px" }}>
            {customerId}
          </Text>
        ),
      },
    ],
    [],
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
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
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
        <div style={{ flex: "1", minWidth: "300px", maxWidth: "500px" }}>
          <Search
            placeholder="Search by customer name, email, or plan"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
            onChange={handleSearchChange}
          />
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Button
            size="large"
            icon={<SolutionOutlined />}
            onClick={() => {
              navigate("/subscriptions/plans");
            }}
          >
            Manage Plans
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => {
              navigate("/subscriptions/subscription");
            }}
          >
            New Subscription
          </Button>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: "8px", padding: "24px" }}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={data?.data.data}
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.data.totalItems || data?.data.data?.length || 0,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              if (newPageSize !== limit) {
                setLimit(newPageSize);
              }
            },
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} subscriptions`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          scroll={{ x: 1400 }}
        />
      </div>
    </div>
  );
}
