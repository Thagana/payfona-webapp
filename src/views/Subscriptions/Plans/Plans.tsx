import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import { PlanType } from "../interface/plan.interface";
import Axios from "../../../networking/adaptor";
import { Button, Checkbox, Input, Table } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { SearchProps } from "antd/es/input";
import { PlusOutlined } from "@ant-design/icons";
import { columns } from "../data/plans-columns";
const { Search } = Input;

export default function Plans() {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);

  const { data, error, isError, isLoading } = useQuery<{
    data: {
      data: PlanType[];
    };
  }>({
    queryKey: ["plans", page, limit],
    queryFn: async () => {
      // FIXED: Changed from template literal syntax to proper function call
      return Axios.get(`/plans?page=${page}&limit=${limit}`);
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
    (record: PlanType, selected: boolean) => {
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

  const rowSelection: TableRowSelection<PlanType> = {
    selectedRowKeys,
    type: "checkbox",
    fixed: true,
    onSelect: handleSelect,
    columnTitle: headerCheckbox,
    onSelectAll: toggleSelectAll,
  };

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
            placeholder="Search plans"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => {
              navigate("/subscriptions/plan");
            }}
          >
            New Plan
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
            showTotal: (total) => `Total ${total} plans`,
          }}
        />
      </div>
    </div>
  );
}
