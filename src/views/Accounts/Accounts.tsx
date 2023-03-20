import * as React from "react";
import { useStoreState } from "easy-peasy";
import { Model } from "../../store/model";
import { useNavigate } from "react-router-dom";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import Button from "../../components/common/Button";
import TemplateWrapper from "../Template";

import { Account } from "../../store/model";

import "./Accounts.scss";

export default function Accounts() {
  const accounts = useStoreState<Model>((state) => state.accounts);

  const navigate = useNavigate();

  const data = accounts.map((item: Account) => ({
    name: item.name,
    country: item.country,
    accountNumber: item.account_number,
    currency: item.currency,
    isDefault: item.is_default,
  }));

  const handleAddAccount = () => {
    navigate("/accounts/create");
  };
  interface DataType {
    key: string;
    name: string;
    country: string;
    currency: string;
    isDefault: boolean;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
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
      render: (_, record) => <div>{record.isDefault ? "Yes" : "No"}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a href="/delete">{record.isDefault && "Delete"}</a>
        </Space>
      ),
    },
  ];

  return (
    <TemplateWrapper defaultIndex="4">
      <div className="accounts-container">
        {accounts.length === 0 && (
          <div className="empty-account">
            <h3 className="header">Account</h3>
            <div>You have no Bank Account Linked please link an account</div>
            <div>
              <Button
                clickHandler={handleAddAccount}
                state="primary"
                type="button"
              >
                Add Account
              </Button>
            </div>
          </div>
        )}
        {accounts.length !== 0 && (
          <>
            <div className="header">
              <div className="header-info">
                <h3>Link Account</h3>
              </div>
              <div className="buttons">
                <button
                  className="btn btn-primary"
                  onClick={handleAddAccount}
                >
                  Add Account
                </button>
              </div>
            </div>
            <Table columns={columns} dataSource={data} />
          </>
        )}
      </div>
    </TemplateWrapper>
  );
}
