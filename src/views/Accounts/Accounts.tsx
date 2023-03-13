import * as React from "react";
import { useStoreState } from "easy-peasy";
import { Model } from "../../store/model";
import { useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import TemplateWrapper from "../Template";

import "./Accounts.scss";

export default function Accounts() {
  const accounts = useStoreState<Model>((state) => state.accounts);
  const navigate = useNavigate();
  const handleAddAccount = () => {
    navigate("/accounts/create");
  };
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
      </div>
    </TemplateWrapper>
  );
}
