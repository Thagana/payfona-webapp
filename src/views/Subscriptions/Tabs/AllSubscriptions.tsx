import React from "react";
import { PlusOutlined, SolutionOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import { SearchProps } from "antd/es/input";
import { TableRowSelection } from "antd/es/table/interface";
import { useNavigate } from "react-router-dom";
import Axios from "../../../networking/adaptor";
import { SubscriptionType } from "../interface/subscription.interface";
import { columns } from "../data/subscriptions-columns";
const { Search } = Input;

export function AllSubscriptions() {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const navigate = useNavigate();
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);

  const { data, error, isError, isLoading } = useQuery<{
    data: {
      data: SubscriptionType[];
    };
  }>({
    queryKey: ["subscriptions", page, limit],
    queryFn: async () => {
      // FIXED: Changed from template literal syntax to proper function call
      return Axios.get(`/subscriptions?page=${page}&limit=${limit}`);
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

  console.log(data);

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

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
            placeholder="Search subscriptions"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
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
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setLimit(newPageSize);
            },
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} subscriptions`,
          }}
        />
      </div>
    </div>
  );
}
