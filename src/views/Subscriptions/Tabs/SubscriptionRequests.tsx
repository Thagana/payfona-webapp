import React from "react";
import { Checkbox, Input, Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import { SearchProps } from "antd/es/input";
import { TableRowSelection } from "antd/es/table/interface";

import Axios from "../../../networking/adaptor";
import { SubscriptionType } from "../interface/subscription.interface";
import { columns } from "../data/subscription-requests-columns";

const { Search } = Input;

export default function SubscriptionRequests() {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);
  const { data, error, isError, isLoading } = useQuery<{
    data: SubscriptionType[];
  }>({
    queryKey: ["subscription-request"],
    queryFn: async () => {
      return Axios.get(
        `/subscriptions/sub-requests?page=${page}&limit=${limit}`,
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
          selectedRowKeys.length < (data ? data.data.length : 0)
        }
        onChange={toggleSelectAll}
      />
    ),
    [selectedRowKeys, data?.data?.length, toggleSelectAll],
  );

  const rowSelection: TableRowSelection<SubscriptionType> = {
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
          <div className="actions"></div>
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
