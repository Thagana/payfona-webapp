import * as React from "react";
import Select from "react-select";
import { Spin } from "antd";
import Notification from "antd/es/notification";
import { useNavigate, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import Button from "../../../components/common/Button";
import AccountNetwork from "../../../networking/accounts";
import { Model } from "../../../store/model";
import "./CreateAccount.scss";

type BankAccounts = {
  id: number;
  name: string;
  slug: string;
  code: string;
  currency: string;
};

type BankOption = {
  value: string;
  label: string;
};

export default function CreateAccount() {
  const navigate = useNavigate();
  const { id } = useParams(); // <-- if we come from edit route

  const [banks, setBanks] = React.useState<BankOption[]>([]);
  const [accountNumber, setAccountNumber] = React.useState("");
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const token = useStoreState<Model>((state) => state.token);
  const updateAccount = useStoreActions<Model>(
    (action) => action.updateAccount,
  );

  // Fetch banks
  const fetchBanks = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await AccountNetwork.getListedBanks(token);
      if (response.data.success) {
        const banks = response.data.data as BankAccounts[];
        setBanks(banks.map((bank) => ({ value: bank.code, label: bank.name })));
      } else {
        Notification.error({ message: response.data.message });
      }
    } catch (error) {
      console.error(error);
      Notification.error({ message: "Could not load banks." });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // If editing, fetch existing account details
  React.useEffect(() => {
    fetchBanks();
    if (id) {
      (async () => {
        try {
          setIsLoading(true);
          const response = await AccountNetwork.getAccountById(id);
          if (response.data.success) {
            const acc = response.data.data;
            setAccountNumber(acc.account_number);
            setCode(acc.bank_code);
          }
        } catch (err) {
          Notification.error({ message: "Could not load account details." });
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [id, fetchBanks, token]);

  const validateForm = () => {
    if (!accountNumber || !code) {
      Notification.error({ message: "Please fill in all required fields." });
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      let response;
      response = await AccountNetwork.createBankAccount(
        token,
        accountNumber,
        code,
      );

      if (!response.data.success) {
        Notification.error({ message: response.data.message });
      } else {
        updateAccount(response.data.data);
        navigate("/accounts");
        Notification.success({
          message: id
            ? "Account updated successfully"
            : "Account created successfully",
        });
      }
    } catch (error) {
      console.error(error);
      Notification.error({ message: "Something went wrong." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-account-container">
      <form className="form" onSubmit={onSubmit}>
        <h3 style={{ marginBottom: "1.5rem" }}>
          {id ? "Update Account" : "Create Account"}
        </h3>

        <div className="form-group">
          <label htmlFor="account-number" className="label">
            Account Number
          </label>
          <input
            type="text"
            className="form-control"
            name="account-number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bank" className="label">
            Bank
          </label>
          <Select
            className="basic-single"
            classNamePrefix="select"
            isLoading={isLoading}
            isClearable
            isSearchable
            value={banks.find((b) => b.value === code) || null}
            onChange={(value: any) => setCode(value?.value || "")}
            options={banks}
          />
        </div>

        <div className="form-actions">
          <Button type="submit" state="primary" disabled={isLoading}>
            {isLoading ? (
              <Spin size="small" />
            ) : id ? (
              "Update Account"
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
