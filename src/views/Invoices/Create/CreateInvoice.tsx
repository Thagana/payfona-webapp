import * as React from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { notification, Spin, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Button from "../../../components/common/Button";
import TemplateWrapper from "../../Template";
import { Invoice } from "../../../networking/invoice";
import { useStoreState } from "easy-peasy";
import { Model } from "../../../store/model";
import "./CreateInvoice.scss";
import { InvoicePayload } from "../../../interface/InvoicePayload";

type STATES = "LOADING" | "SUCCESS" | "ERROR" | "IDLE";

type InvoiceFormState = {
  fromName: string;
  fromEmail: string;
  fromPhoneNumber: string;
  toName: string;
  toEmail: string;
  toPhoneNumber: string;
  items: { item: string; price: number; quantity: number }[];
  logo: string;
  total: number;
  serverState: STATES;
  errors: Record<string, boolean>;
};

const initialState: InvoiceFormState = {
  fromName: "",
  fromEmail: "",
  fromPhoneNumber: "",
  toName: "",
  toEmail: "",
  toPhoneNumber: "",
  items: [{ item: "", price: 0, quantity: 0 }],
  logo: "",
  total: 0,
  serverState: "IDLE",
  errors: {},
};

interface Action {
  type: "SET_FIELD" | "SET_ITEMS" | "SET_ERROR" | "SET_STATE" | "RESET_FORM";
  field?: keyof InvoiceFormState;
  value?: any;
  items?: InvoiceFormState["items"];
}

function reducer(state: InvoiceFormState, action: Action): InvoiceFormState {
  switch (action.type) {
    case "SET_FIELD":
      if (action.field) {
        return { ...state, [action.field]: action.value };
      }
      return state;
    case "SET_ITEMS":
      return {
        ...state,
        items: action.items || [],
        total: calculateTotal(action.items || []),
      };
    case "SET_ERROR":
      if (action.field) {
        return {
          ...state,
          errors: { ...state.errors, [action.field]: action.value },
        };
      }
      return state;
    case "SET_STATE":
      return { ...state, serverState: action.value as STATES };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

const calculateTotal = (items: { price: number; quantity: number }[]) =>
  items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

export default function CreateInvoice() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const navigate = useNavigate();
  const accounts = useStoreState<Model>((state) => state.accounts);

  const validateField = (name: keyof InvoiceFormState, value: string) => {
    let isValid = true;
    if (!value) isValid = false;
    if (name?.includes("Email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      isValid = false;
    if (name?.includes("PhoneNumber") && !/^\d+$/.test(value)) isValid = false;
    dispatch({ type: "SET_ERROR", field: name, value: !isValid });
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // @ts-ignore
    dispatch({ type: "SET_FIELD", field: name, value });
    // @ts-ignore
    validateField(name, value);
  };

  const handleItemChange = (
    index: number,
    field: "item" | "price" | "quantity",
    value: string
  ) => {
    const updatedItems = [...state.items];
    const newItem = { ...updatedItems[index], [field]: value };
    updatedItems[index] = {
      item: newItem.item,
      price: isNaN(Number(newItem.price)) ? 0 : Number(newItem.price),
      quantity: isNaN(Number(newItem.quantity)) ? 0 : Number(newItem.quantity),
    };
    dispatch({ type: "SET_ITEMS", items: updatedItems });
  };

  const addRow = () =>
    dispatch({
      type: "SET_ITEMS",
      items: [...state.items, { item: "", price: 0, quantity: 0 }],
    });

  const removeRow = (index: number) => {
    const filteredItems = state.items.filter((_, i) => i !== index);
    dispatch({ type: "SET_ITEMS", items: filteredItems });
  };

  const onSubmit = async () => {
    dispatch({ type: "SET_STATE", value: "LOADING" });

    const invoiceData: InvoicePayload = {
      from: {
        name: state.fromName,
        email: state.fromEmail,
        phoneNumber: state.fromPhoneNumber,
      },
      to: {
        name: state.toName,
        email: state.toEmail,
        phoneNumber: state.toPhoneNumber,
      },
      items: state.items.map((item) => ({
        item: item.item,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
      logo: state.logo,
      total: state.total * 100,
      invoiceDate: new Date().toISOString(),
      currency: "ZAR",
      companyNote: "",
    };

    try {
      const response = await Invoice.createInvoice(invoiceData);
      if (response?.data?.success) {
        notification.success({ message: "Invoice created successfully!" });
        dispatch({ type: "RESET_FORM" }); // Reset the form after successful submission
        navigate(`/invoice/${response.data.data}`);
      } else {
        throw new Error(response?.data?.message || "Failed to create invoice");
      }
    } catch (error: any) {
      notification.error({
        message: error.message || "Failed to create invoice",
      });
      dispatch({ type: "SET_STATE", value: "IDLE" });
    }
  };

  return (
    <TemplateWrapper defaultIndex="2">
      <div className="wrapper">
        {state.serverState === "LOADING" ? (
          <Spin size="large" className="loading" />
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className="wrapper-invoice">
              <div className="header">
                <span>Invoice</span>
                <Select
                  className="basic-single"
                  defaultValue={{ label: "Default Logo", value: "" }}
                  options={[{ label: "Default Logo", value: "" }]}
                  onChange={(opt: { value: any }) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "logo",
                      value: opt?.value,
                    })
                  }
                />
              </div>
              <div className="details-container">
                {["from", "to"].map((prefix) => (
                  <div key={prefix} className={`details-${prefix}`}>
                    <div>{prefix === "from" ? "From" : "To"}</div>
                    {["Name", "Email", "PhoneNumber"].map((field: string) => {
                      const prefixName =
                        `${prefix}${field}` as keyof InvoiceFormState;
                      const name = prefixName; // Explicitly type name
                      return (
                        <input
                          key={name}
                          className={`form-control ${
                            state.errors[name] ? "in-valid" : ""
                          }`}
                          type={field === "Email" ? "email" : "text"}
                          placeholder={field}
                          value={state[name] as any}
                          onChange={handleFieldChange}
                          name={name}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="invoice-items">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.items.map(
                      (
                        item: {
                          item: string;
                          price: number;
                          quantity: number;
                        },
                        index: number
                      ) => (
                        <tr key={index}>
                          {["item", "price", "quantity"].map(
                            (field: any) => (
                              <td key={field}>
                                <input
                                  className="form-control"
                                  type={field === "item" ? "text" : "number"}
                                  value={item[field as "item" | "price" | "quantity"]}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      field,
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                          <td>{(item.price * item.quantity).toFixed(2)}</td>
                          <td>
                            {state.items.length > 1 && (
                              <Button
                                onClick={() => removeRow(index)}
                                type="button"
                                state="primary"
                              >
                                <DeleteOutlined />
                              </Button>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <Button onClick={addRow} type="button" state="primary">
                  + Add Row
                </Button>
              </div>

              <Button
                onClick={onSubmit}
                type="submit"
                state="primary"
              >
                Send Invoice
              </Button>
            </div>
          </form>
        )}
      </div>
      <Modal
        open={accounts.length === 0}
        onOk={() => navigate("/accounts/create")}
        footer={
          <Button
            key="submit"
            type="button"
            state="primary"
            onClick={() => navigate("/accounts/create")}
          >
            Link Account
          </Button>
        }
      >
        Link a bank account to receive invoice payments.
      </Modal>
    </TemplateWrapper>
  );
}
