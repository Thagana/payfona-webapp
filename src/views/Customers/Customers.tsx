import * as React from "react";
import Highlighter from "react-highlight-words";
import type { InputRef } from "antd";
import { Button, Input, notification, Space, Table, Typography } from "antd/es";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import {
  DeleteFilled,
  DeleteOutlined,
  EyeFilled,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

const { Text } = Typography;

import Axios from "../../networking/adaptor";

import { DataType } from "./interface/DataType";

type DataIndex = keyof DataType;

import "./Customers.scss";

export default function Customer() {
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const searchInput = React.useRef<InputRef>(null);

  const { isPending, isError, isSuccess, mutate } = useMutation({
    mutationFn: (id: number) => {
      return Axios.delete(`/customer/${id}`);
    },
  });
  const customers = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      return Axios.get("/customer");
    },
  });

  const navigation = useNavigate();

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
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
    dataIndex: DataIndex
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
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleDeleteCustomer = async (id: number) => {
    try {
      mutate(id);
    } catch (error) {
      notification.open({
        message: "Something went wrong trying to delete customer",
        type: "error",
      });
    }
  };


  const handleEdit = async (id: number) => {
    try {
      navigation(`/customers/create/${id}`)
    } catch (error) {
      notification.open({
        message: "Something went wrong trying to delete customer",
        type: "error",
      });
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      ...getColumnSearchProps("firstName"),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      ...getColumnSearchProps("lastName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phone_numberail",
      ...getColumnSearchProps("phoneNumber"),
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<DeleteFilled color="red" />}
            onClick={() => handleDeleteCustomer(record.id)}
          >
              Delete
          </Button>
          <Button type="default" icon={<EyeFilled />} onClick={() => handleEdit(record.id)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddCustomer = () => {
    navigation("/customers/create");
  };

  return (
    <div className="customer-container">
      <div className="row p-2">
        <div className="col-md-12">
          <Button
            onClick={handleAddCustomer}
            type="primary"
            size="large"
            icon={<PlusOutlined />}
          >
            Customer
          </Button>
        </div>
      </div>
      <div className="table">
        <Table
          columns={columns}
          dataSource={customers?.data?.data?.data}
          loading={customers.isLoading}
        />
      </div>
    </div>
  );
}
