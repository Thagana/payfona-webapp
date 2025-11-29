import * as React from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Model, Account } from "../../store/model";
import { useNavigate } from "react-router-dom";
import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import Notification from "antd/es/notification";
import Button from "../../components/common/Button";
import AccountNetwork from "../../networking/accounts";
import "./Accounts.scss";

interface DataType {
  key: string;
  id: number;
  name: string;
  country: string;
  currency: string;
  accountNumber: string;
  isDefault: boolean;
}

export default function Accounts() {
  const accounts = useStoreState<Model>((state) => state.accounts);
  const token = useStoreState<Model>((state) => state.token);
  const updateAccount = useStoreActions<Model>(
    (action) => action.updateAccount,
  );
  const navigate = useNavigate();

  const data: DataType[] = accounts.map((item: Account) => ({
    key: item.id.toString(),
    id: item.id,
    name: item.name,
    country: item.country,
    accountNumber: item.account_number,
    currency: item.currency,
    isDefault: item.is_default,
  }));

  const handleAddAccount = () => navigate("/accounts/create");
  const handleEdit = (id: number) => navigate(`/accounts/${id}/edit`);

  const handleDelete = async (id: number) => {
    try {
      const response = await AccountNetwork.deleteAccount(token, id);
      if (!response.data.success) {
        Notification.error({ message: response.data.message });
      } else {
        updateAccount(response.data.data);
        Notification.success({ message: "Successfully deleted an account" });
      }
    } catch (error) {
      console.error(error);
      Notification.error({
        message: "Something went wrong. Please try again.",
      });
    }
  };

  const handleMakeDefault = async (id: number) => {
    try {
      const response = await AccountNetwork.makeDefault(token, id);
      if (!response.data.success) {
        Notification.error({ message: response.data.message });
      } else {
        updateAccount(response.data.data);
        Notification.success({
          message: "Successfully made an account default",
        });
      }
    } catch (error) {
      console.error(error);
      Notification.error({
        message: "Something went wrong. Please try again.",
      });
    }
  };

  const columns: ColumnsType<DataType> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Currency", dataIndex: "currency", key: "currency" },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Default",
      key: "default",
      render: (_, record) => <span>{record.isDefault ? "Yes" : "No"}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="button"
            state="secondary"
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          <Button
            type="button"
            state={record.isDefault ? "danger" : "primary"}
            onClick={() =>
              record.isDefault
                ? handleDelete(record.id)
                : handleMakeDefault(record.id)
            }
          >
            {record.isDefault ? "Delete" : "Make Default"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="accounts-container">
      {accounts.length === 0 ? (
        <div className="empty-account">
          <h3>No Linked Accounts</h3>
          <p>You don’t have any bank accounts linked yet.</p>
          <Button onClick={handleAddAccount} state="primary" type="button">
            Add Account
          </Button>
        </div>
      ) : (
        <>
          <div className="header">
            <h3>Linked Accounts</h3>
            <Button onClick={handleAddAccount} state="primary" type="button">
              Add Account
            </Button>
          </div>
          <Table columns={columns} dataSource={data} rowKey="id" />
        </>
      )}
    </div>
  );
}
