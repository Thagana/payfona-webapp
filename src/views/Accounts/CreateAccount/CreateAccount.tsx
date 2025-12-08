import * as React from "react";
import Select from "react-select";
import { Button, Card, Input, Spin, notification, Form } from "antd/es";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
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
  const { id } = useParams();
  const [form] = Form.useForm();

  const [banks, setBanks] = React.useState<BankOption[]>([]);
  const [accountNumber, setAccountNumber] = React.useState("");
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetchingBanks, setIsFetchingBanks] = React.useState(false);

  const token = useStoreState<Model>((state) => state.token);
  const updateAccount = useStoreActions<Model>(
    (action) => action.updateAccount,
  );

  // Fetch banks
  const fetchBanks = React.useCallback(async () => {
    try {
      setIsFetchingBanks(true);
      const response = await AccountNetwork.getListedBanks(token);
      if (response.data.success) {
        const banks = response.data.data as BankAccounts[];
        setBanks(banks.map((bank) => ({ value: bank.code, label: bank.name })));
      } else {
        notification.error({ message: response.data.message });
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: "Could not load banks." });
    } finally {
      setIsFetchingBanks(false);
    }
  }, [token]);

  // If editing, fetch existing account details
  React.useEffect(() => {
    fetchBanks();
    if (id) {
      (async () => {
        try {
          setIsLoading(true);
          const response = await AccountNetwork.getAccountById(token, id);
          if (response.data.success) {
            const acc = response.data.data;
            setAccountNumber(acc.account_number);
            setCode(acc.bank_code);
            form.setFieldsValue({
              accountNumber: acc.account_number,
            });
          }
        } catch (err) {
          console.error(err);
          notification.error({ message: "Could not load account details." });
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [id, fetchBanks, token, form]);

  const validateForm = () => {
    if (!accountNumber || !code) {
      notification.error({ message: "Please fill in all required fields." });
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await AccountNetwork.createBankAccount(
        token,
        accountNumber,
        code,
      );

      if (!response.data.success) {
        notification.error({ message: response.data.message });
      } else {
        updateAccount(response.data.data);
        notification.success({
          message: id
            ? "Account updated successfully"
            : "Account created successfully",
        });
        navigate("/accounts");
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: "Something went wrong." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/accounts");
  };

  return (
    <div className="create-account-container">
      {/* Header Section */}
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={handleCancel}
                style={{ marginRight: "12px" }}
              />
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
                {id ? "Update Account" : "Create New Account"}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Spin
                spinning={isLoading && !!id}
                tip="Loading account details..."
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onSubmit}
                  disabled={isLoading}
                >
                  <div className="row g-3">
                    {/* Account Number */}
                    <div className="col-12">
                      <Form.Item
                        label={
                          <span style={{ fontWeight: 500, fontSize: "14px" }}>
                            Account Number
                          </span>
                        }
                        name="accountNumber"
                        rules={[
                          {
                            required: true,
                            message: "Please enter account number",
                          },
                          {
                            pattern: /^[0-9]+$/,
                            message: "Account number must contain only digits",
                          },
                          {
                            min: 10,
                            message:
                              "Account number must be at least 10 digits",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Enter account number"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          style={{ borderRadius: "8px" }}
                        />
                      </Form.Item>
                    </div>

                    {/* Bank Select */}
                    <div className="col-12">
                      <Form.Item
                        label={
                          <span style={{ fontWeight: 500, fontSize: "14px" }}>
                            Bank
                          </span>
                        }
                        required
                      >
                        <Select
                          className="bank-select"
                          classNamePrefix="select"
                          isLoading={isFetchingBanks}
                          isClearable
                          isSearchable
                          placeholder="Select a bank"
                          value={banks.find((b) => b.value === code) || null}
                          onChange={(value: any) => setCode(value?.value || "")}
                          options={banks}
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: "40px",
                              borderRadius: "8px",
                              borderColor: "#d9d9d9",
                              "&:hover": {
                                borderColor: "#4096ff",
                              },
                            }),
                            menu: (base) => ({
                              ...base,
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }),
                          }}
                        />
                        {!code && (
                          <div
                            style={{
                              color: "#ff4d4f",
                              fontSize: "14px",
                              marginTop: "4px",
                            }}
                          >
                            Please select a bank
                          </div>
                        )}
                      </Form.Item>
                    </div>

                    {/* Account Information Help */}
                    <div className="col-12">
                      <div
                        style={{
                          background: "#f0f5ff",
                          border: "1px solid #adc6ff",
                          borderRadius: "8px",
                          padding: "12px 16px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#1d39c4",
                            marginBottom: "4px",
                            fontWeight: 500,
                          }}
                        >
                          💡 Account Information
                        </div>
                        <div style={{ fontSize: "13px", color: "#595959" }}>
                          Make sure the account number and bank details are
                          correct. This account will be used for payouts and
                          transactions.
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="col-12" style={{ marginTop: "8px" }}>
                      <div className="row g-2">
                        <div className="col-6">
                          <Button
                            size="large"
                            onClick={handleCancel}
                            disabled={isLoading}
                            style={{ width: "100%", borderRadius: "8px" }}
                          >
                            Cancel
                          </Button>
                        </div>
                        <div className="col-6">
                          <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            loading={isLoading}
                            icon={!isLoading && <SaveOutlined />}
                            style={{ width: "100%", borderRadius: "8px" }}
                          >
                            {id ? "Update Account" : "Create Account"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              </Spin>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
