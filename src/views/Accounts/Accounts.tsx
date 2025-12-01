import * as React from "react";
import type { GetProps, InputRef } from "antd";
import {
  Button,
  Input,
  notification,
  Space,
  Table,
  Tag,
  Popconfirm,
} from "antd/es";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import {
  DeleteFilled,
  EditFilled,
  PlusOutlined,
  SearchOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Model, Account } from "../../store/model";
import AccountNetwork from "../../networking/accounts";
import "./Accounts.scss";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

interface DataType {
  key: string;
  id: number;
  name: string;
  country: string;
  currency: string;
  accountNumber: string;
  isDefault: boolean;
}

type DataIndex = keyof DataType;

export default function Accounts() {
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const searchInput = React.useRef<InputRef>(null);

  const navigate = useNavigate();
  const token = useStoreState<Model>((state) => state.token);

  // Use Easy Peasy state for accounts (like original)
  const accounts = useStoreState<Model>((state) => state.accounts);
  const updateAccount = useStoreActions<Model>(
    (action) => action.updateAccount,
  );

  // Delete account mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return AccountNetwork.deleteAccount(token, id);
    },
    onSuccess: (response) => {
      if (response.data.success) {
        updateAccount(response.data.data);
        notification.success({
          message: "Account deleted successfully",
        });
      } else {
        notification.error({
          message: response.data.message || "Failed to delete account",
        });
      }
    },
    onError: (error) => {
      console.error(error);
      notification.error({
        message: "Something went wrong trying to delete account",
      });
    },
  });

  // Make default mutation
  const makeDefaultMutation = useMutation({
    mutationFn: (id: number) => {
      return AccountNetwork.makeDefault(token, id);
    },
    onSuccess: (response) => {
      if (response.data.success) {
        updateAccount(response.data.data);
        notification.success({
          message: "Account set as default successfully",
        });
      } else {
        notification.error({
          message: response.data.message || "Failed to set as default",
        });
      }
    },
    onError: (error) => {
      console.error(error);
      notification.error({
        message: "Something went wrong trying to set default account",
      });
    },
  });

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: string) => text,
  });

  const handleAddAccount = () => {
    navigate("/accounts/create");
  };

  const handleEdit = (id: number) => {
    navigate(`/accounts/${id}/edit`);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleMakeDefault = (id: number) => {
    makeDefaultMutation.mutate(id);
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      ...getColumnSearchProps("currency"),
      sorter: (a, b) => a.currency.localeCompare(b.currency),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
      ...getColumnSearchProps("accountNumber"),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      ...getColumnSearchProps("country"),
      sorter: (a, b) => a.country.localeCompare(b.country),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Default",
      key: "isDefault",
      align: "center",
      filters: [
        { text: "Default", value: true },
        { text: "Not Default", value: false },
      ],
      onFilter: (value, record) => record.isDefault === value,
      render: (_, record) =>
        record.isDefault ? (
          <Tag color="success" icon={<CheckCircleFilled />}>
            Default
          </Tag>
        ) : (
          <Tag color="default">Not Default</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {!record.isDefault && (
            <Button
              type="primary"
              icon={<CheckCircleFilled />}
              onClick={() => handleMakeDefault(record.id)}
            >
              Make Default
            </Button>
          )}
          <Button
            type="default"
            icon={<EditFilled />}
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          {record.isDefault ? (
            <Popconfirm
              title="Cannot delete default account"
              description="Please set another account as default first."
              onConfirm={() => {}}
              okText="OK"
              cancelButtonProps={{ style: { display: "none" } }}
            >
              <Button type="primary" danger icon={<DeleteFilled />} disabled>
                Delete
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Delete account"
              description="Are you sure you want to delete this account?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger icon={<DeleteFilled />}>
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const dataSource: DataType[] = accounts.map((item: Account) => ({
    key: item.id.toString(),
    id: item.id,
    name: item.name,
    country: item.country,
    accountNumber: item.account_number,
    currency: item.currency,
    isDefault: item.is_default,
  }));

  return (
    <div className="accounts-container">
      {/* Search Bar and Add Button - Bootstrap Grid */}
      <div className="accounts-search">
        <div className="container-fluid">
          <div className="row g-3 align-items-center p-3">
            <div className="col-12 col-md-6 col-lg-4">
              <Search
                placeholder="Search accounts"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-auto ms-lg-auto">
              <Button
                onClick={handleAddAccount}
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                style={{ width: "100%" }}
              >
                Add Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="table-wrapper">
              <Table
                columns={columns}
                dataSource={dataSource}
                loading={
                  deleteMutation.isPending || makeDefaultMutation.isPending
                }
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} accounts`,
                }}
                locale={{
                  emptyText: (
                    <div style={{ padding: "40px", textAlign: "center" }}>
                      <h3>No Linked Accounts</h3>
                      <p style={{ color: "#8c8c8c", marginBottom: "20px" }}>
                        You don't have any bank accounts linked yet.
                      </p>
                      <Button
                        onClick={handleAddAccount}
                        type="primary"
                        icon={<PlusOutlined />}
                      >
                        Add Your First Account
                      </Button>
                    </div>
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
