import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import { SearchProps } from "antd/es/input";
import { TableRowSelection } from "antd/es/table/interface";
import { useNavigate } from "react-router-dom";

import Axios from "../../networking/adaptor";
import { columns } from "./data/columns";
import { TransactionType } from "./interfaces/transactions.interface";

const { Search } = Input;

export default function Transactions() {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const navigate = useNavigate();
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);
  const { data, error, isError, isLoading } = useQuery<{
    data: TransactionType[];
  }>({
    queryKey: ["transactions"],
    queryFn: async () => {
      return Axios.get(`/transactions?page=${page}&limit=${limit}`);
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
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);
  return (
    <div className="home-container">
      <div className="home-header py-2">
        <div className="header-invoice">
          <Search
            placeholder="Search subscriptions"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />
        </div>
        <div>
          <div className="actions">
            <div className="create-invoice">
              <Button className="btn btn-primary add-invoice">
                <PlusOutlined />
                <div className="add-invoice-text">Export Report</div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data?.data}
        loading={isLoading}
      />
    </div>
  );
}
