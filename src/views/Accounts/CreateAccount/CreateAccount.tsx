import * as React from "react";
import Select from "react-select";
import { Spin } from 'antd';
import Notification from "antd/es/notification";
import { useNavigate } from "react-router-dom";
import TemplateWrapper from "../../Layout";

import "./CreateAccount.scss";
import AccountNetwork from "../../../networking/accounts";
import { useStoreActions, useStoreState } from "easy-peasy";
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
  
  // Hooks
  const navigate = useNavigate();
  
  const [accounts, setAccounts] = React.useState<BankAccount[]>([]);
  const [accountNumber, setAccountNumber] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [code, setCode] = React.useState("");

  const token = useStoreState<Model>((state) => state.token);
  const updateAccount = useStoreActions<Model>(action => action.updateAccount);

  const fetchAvailableAccounts = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await AccountNetwork.getListedBanks(token);
      if (response.data.success) {
        const banks = response.data.data as BankAccounts[];

        const data = banks.map((bank) => ({
          value: bank.code,
          label: bank.name,
        }));

        setAccounts(data);

      } else {
        Notification.error({
          message: response.data.message,
        });
      }
    } catch (error) {
      console.error(error);
      Notification.error({
        message: "Something went wrong please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const validateForm = () => {
    if (!accountNumber || !code) {
      Notification.error({
        message: "Please fill in all required fields.",
      });
      return false;
    }
    return true;
  };

  const onSubmit = React.useCallback(async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await AccountNetwork.createBankAccount(
        token,
        accountNumber,
        code
      );
      if (!response.data.success) {
        Notification.error({
          message: response.data.message,
        });
      } else {
        const data = response.data;
        updateAccount(data.data);
        navigate('/accounts');
      }
    } catch (error) {
      console.error(error);
      Notification.error({
        message: "Something went wrong please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, accountNumber, code, updateAccount, navigate, validateForm]);

  React.useEffect(() => {
    fetchAvailableAccounts();
  }, [fetchAvailableAccounts]);

  return (
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
            <label htmlFor="account-name" className="label">Account Name</label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={false}
              isLoading={isLoading}
              isClearable={true}
              isSearchable={true}
              onChange={(value: any) => setCode(value?.value || '')}
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
  );
}
