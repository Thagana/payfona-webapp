import * as React from "react";
import Notification from "antd/es/notification";

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

export default function CreateAccount() {
  const [accounts, setAccounts] = React.useState<BankAccounts[]>([]);

  const token = useStoreState<Model>((state) => state.token);

  const fetchAvailableAccounts = async () => {
    try {
      const response = await Accounts.getListedBanks(token);
    } catch (error) {
      console.log(error);
      Notification.error({
        message: "Something went wrong please try again later",
      });
    }
  };

  React.useEffect(() => {
    fetchAvailableAccounts();
  }, []);

  return (
    <TemplateWrapper defaultIndex="3">
      <div className="create-account-container">
        {accounts.map((account) => (
          <div className="account">
            <div className="Name">{account.name}</div>
          </div>
        ))}
      </div>
    </TemplateWrapper>
  );
}
