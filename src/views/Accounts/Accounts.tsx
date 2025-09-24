import * as React from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Model } from "../../store/model";
import { useNavigate } from "react-router-dom";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Notification from "antd/es/notification";
import Button from "../../components/common/Button";
import TemplateWrapper from "../Layout";

import { Account } from "../../store/model";

import AccountNetwork from "../../networking/accounts";

import "./Accounts.scss";

interface DataType {
  key: string;
  id: number;
  name: string;
  country: string;
  currency: string;
  isDefault: boolean;
}

export default function Accounts() {
  const accounts = useStoreState<Model>((state) => state.accounts);
  const token = useStoreState<Model>((state) => state.token);
  const updateAccount = useStoreActions<Model>(
    (action) => action.updateAccount,
  );
  const navigate = useNavigate();

  const data = accounts.map((item: Account) => ({
    key: item.id.toString(),
    id: item.id,
    name: item.name,
    country: item.country,
    accountNumber: item.account_number,
    currency: item.currency,
    isDefault: item.is_default,
  }));

  const handleAddAccount = React.useCallback(() => {
    navigate("/accounts/create");
  }, [navigate]);

  const handleDelete = React.useCallback(
    async (id: number) => {
      try {
        const response = await AccountNetwork.deleteAccount(token, id);
        if (!response.data.success) {
          Notification.error({
            message: response.data.message,
          });
        } else {
          updateAccount(response.data.data);
          Notification.success({
            message: "Successfully deleted an account",
          });
        }
      } catch (error) {
        console.error(error);
        Notification.error({
          message: "Something went wrong please try again later",
        });
      }
    },
    [token, updateAccount],
  );

  const handleMakeDefault = React.useCallback(
    async (id: number) => {
      try {
        const response = await AccountNetwork.makeDefault(token, id);
        if (!response.data.success) {
          Notification.error({
            message: response.data.message,
          });
        } else {
          updateAccount(response.data.data);
          Notification.success({
            message: "Successfully made an account default",
          });
        }
      } catch (error) {
        console.error(error);
        Notification.error({
          message: "Something went wrong please try again later",
        });
      }
    },
    [token, updateAccount],
  );

  const renderName = React.useCallback((text: string) => <a>{text}</a>, []);

  const renderDefault = React.useCallback(
    (_: any, record: DataType) => <div>{record.isDefault ? "Yes" : "No"}</div>,
    [],
  );

  const renderAction = React.useCallback(
    (_: any, record: DataType) => (
      <Space size="middle">
        <Button
          type="button"
          state={record.isDefault ? "primary" : "secondary"}
          onClick={() => {
            if (record.isDefault) {
              handleDelete(record.id);
            } else {
              handleMakeDefault(record.id);
            }
          }}
        >
          {record.isDefault ? "Delete" : "Make default"}
        </Button>
      </Space>
    ),
    [handleDelete, handleMakeDefault],
  );

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: renderName,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Default",
      key: "default",
      dataIndex: "default",
      render: renderDefault,
    },
    {
      title: "Action",
      key: "action",
      render: renderAction,
    },
  ];

  return (
    <div className="accounts-container">
      {accounts.length === 0 ? (
        <div className="empty-account">
          <h3 className="header">Account</h3>
          <div>You have no Bank Account Linked please link an account</div>
          <div>
            <Button onClick={handleAddAccount} state="primary" type="button">
              Add Account
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="header">
            <div className="header-info">
              <h3>Link Account</h3>
            </div>
            <div className="buttons">
              <button className="btn btn-primary" onClick={handleAddAccount}>
                Add Account
              </button>
            </div>
          </div>
          <Table columns={columns} dataSource={data} />
        </>
      )}
    </div>
  );
}
