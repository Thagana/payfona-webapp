import * as React from "react";
import Select from "react-select";
import { Spin } from 'antd';
import Notification from "antd/es/notification";
import { useNavigate } from "react-router-dom";
import TemplateWrapper from "../../Template";

import "./CreateAccount.scss";
import { Accounts } from "../../../networking/accounts";
import { useStoreState } from "easy-peasy";
import { Model } from "../../../store/model";

type BankAccounts = {
  id: number;
  name: string;
  slug: string;
  code: string;
  currency: string;
};

type BankAccount = {
  value: string;
  label: string;
}

export default function CreateAccount() {
  const [accounts, setAccounts] = React.useState<BankAccount[]>([]);
  const [accountNumber, setAccountNumber] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [code, setCode] = React.useState("");

  const token = useStoreState<Model>((state) => state.token);
  const navigate = useNavigate();
  const fetchAvailableAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await Accounts.getListedBanks(token);
      if (response.data.success) {
        const banks = response.data.data as BankAccounts[];

        const data = banks.map((bank) => {
          return {
            value: bank.code,
            label: bank.name,
          }
        });

        setAccounts(data);

      } else {
        Notification.error({
          message: response.data.message,
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Notification.error({
        message: "Something went wrong please try again later",
      });
      setIsLoading(false);
    }
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const response = await Accounts.createBankAccount(
        token,
        accountNumber,
        code
      )
      if (!response.data.success) {
        Notification.error({
          message: response.data.message,
        })
      } else {
        const data = response.data;
        navigate('/accounts');
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Notification.error({
        message: "Something went wrong please try again later",
      });
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    fetchAvailableAccounts();
  }, []);

  return (
    <TemplateWrapper defaultIndex="3">
      <div className="create-account-container">
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="account-number" className="label">Account Number</label>
            <input
              type="text"
              className="form-control"
              name="account-number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="account-number" className="label">Account Name</label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={false}
              isLoading={isLoading}
              isClearable={true}
              isSearchable={true}
              onChange={(value) => setCode(value?.value || '')}
              name="code"
              options={accounts}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              {isLoading ? <Spin style={{ color: "#8300c4" }} /> : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </TemplateWrapper>
  );
}
