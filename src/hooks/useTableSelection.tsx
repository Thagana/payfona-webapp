import React from "react";
import { Checkbox } from "antd";
import { TableRowSelection } from "antd/es/table/interface";

interface UseTableSelectionProps<T> {
  data: T[] | undefined;
  getRowKey: (record: T) => React.Key;
}

interface UseTableSelectionReturn<T> {
  selectedRowKeys: React.Key[];
  rowSelection: TableRowSelection<T>;
  clearSelection: () => void;
  selectAll: () => void;
}

export function useTableSelection<T>({
  data,
  getRowKey,
}: UseTableSelectionProps<T>): UseTableSelectionReturn<T> {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  const toggleSelectAll = React.useCallback(() => {
    if (data) {
      setSelectedRowKeys((keys) =>
        keys.length === data.length ? [] : data.map((record) => getRowKey(record)),
      );
    }
  }, [data, getRowKey]);

  const handleSelect = React.useCallback(
    (record: T, selected: boolean) => {
      const key = getRowKey(record);
      setSelectedRowKeys((keys) =>
        selected ? [...keys, key] : keys.filter((k) => k !== key),
      );
    },
    [getRowKey],
  );

  const headerCheckbox = React.useMemo(
    () => (
      <Checkbox
        checked={selectedRowKeys.length > 0}
        indeterminate={
          selectedRowKeys.length > 0 &&
          selectedRowKeys.length < (data ? data.length : 0)
        }
        onChange={toggleSelectAll}
      />
    ),
    [selectedRowKeys, data?.length, toggleSelectAll],
  );

  const rowSelection: TableRowSelection<T> = React.useMemo(
    () => ({
      selectedRowKeys,
      type: "checkbox",
      fixed: true,
      onSelect: handleSelect,
      columnTitle: headerCheckbox,
      onSelectAll: toggleSelectAll,
    }),
    [selectedRowKeys, handleSelect, headerCheckbox, toggleSelectAll],
  );

  const clearSelection = React.useCallback(() => {
    setSelectedRowKeys([]);
  }, []);

  const selectAll = React.useCallback(() => {
    if (data) {
      setSelectedRowKeys(data.map((record) => getRowKey(record)));
    }
  }, [data, getRowKey]);

  return {
    selectedRowKeys,
    rowSelection,
    clearSelection,
    selectAll,
  };
}
