import * as React from "react";
import TemplateWrapper from "../../Template";
import Upload from "antd/es/upload";
import ImgCrop from "antd-img-crop";
import Notification from "antd/es/notification";
import { DeleteOutlined } from "@ant-design/icons";
import Button from "../../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { useForm } from "react-hook-form";

import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { formatInvoiceDate } from "../../../helper/formatInvoiceDate";

import "./CreateInvoice.scss";
import { Invoice } from "../../../networking/invoice";

type STATES = "LOADING" | "SUCCESS" | "ERROR" | "IDLE";

export default function CreateInvoice() {
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [total, setTotal] = React.useState(0);

  const [serverStates, setServerStates] = React.useState<STATES>("IDLE");


  
  // from
  const [fromName, setFromName] = React.useState("");
  const [fromNameTouches, setFromNameTouched] = React.useState(false);
  const [fromNameError, setFromNameError] = React.useState(false);
  
  const [fromEmail, setFromEmail] = React.useState("");
  const [fromEmailTouched, setFromEmailTouched] = React.useState(false);
  const [fromEmailError, setFromEmailError] = React.useState(false);


  const [fromPhoneNumber, setFromPhoneNumber] = React.useState("");
  const [fromPhoneNumberTouched, setFromPhoneNumberTouched] = React.useState(false);
  const [fromPhoneNumberError, setFromPhoneNumberError] = React.useState(false);

  // to
  const [toName, setToName] = React.useState("");
  const [toNameTouched, setToNameTouched] = React.useState(false);
  const [toNameError, setToNameError] = React.useState(false);

  const [toEmail, setToEmail] = React.useState("");
  const [toEmailTouched, setToEmailTouched] = React.useState(false);
  const [toEmailError, setToEmailError] = React.useState(false);
  
  const [toPhoneNumber, setToPhoneNumber] = React.useState("");
  const [toPhoneNumberTouched, setToPhoneNumberTouched] = React.useState(false);
  const [toPhoneNumberError, setToPhoneNumberError] = React.useState(false);

  
  const [everyThingValid, setEveryThingValid] = React.useState(false);


  const [items, setItems] = React.useState([
    { item: "", price: 0, quantity: 0, amount: 0 },
  ]);

  const [date] = React.useState(() => {
    return new Date().toISOString();
  });

  const navigate = useNavigate();

  const handleRemoveRow = (index: number) => {
    const newFileList = items.filter((item, i) => i !== index);
    setItems(newFileList);
  };

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const calculateTotal = (
    _amount: { price: number; amount: number; quantity: number }[]
  ) => {
    const final = _amount.reduce((acc, curr) => {
      return parseFloat((acc + curr.price * curr.quantity).toFixed(2));
    }, 0);
    setTotal(final);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const temp = [...items];
    temp[index][name] = value;
    setItems([...temp]);
    calculateTotal(temp);
  };

  const handleAppendRows = () => {
    const newValue = { item: "", price: 0, quantity: 0, amount: 0 };
    setItems([...items, newValue]);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const validateFromDetails = (fromData: {
    name: string;
    email: string;
    phoneNumber: string;
  }) => {
    let valid = false;
    if (fromData.name === "") {
      setFromNameError(true);
      valid = false;
    } else {
      setFromNameError(false);
      valid = false;
    }
    if (fromData.email === "") {
      setFromEmailError(true);
      valid = false;
    } else {
      setFromEmailError(false);
      valid = true;
    }
    if (fromData.phoneNumber === "") {
      setFromPhoneNumberError(true);
      valid = false;
    } else {
      setFromPhoneNumberError(false);
      valid = true;
    }
    return valid;
  };

  const validateToDetails = (toData: {
    name: string;
    email: string;
    phoneNumber: string;
  }) => {
    let valid = true;
    if (toData.name === "") {
      valid = false;
    } else {
      valid = false;
    }

    if (toData.email === "") {
      
    } else {

    }

    if (toData.phoneNumber === "") {
    
    } else {

    }

    return valid;
  };

  const createInvoice = async () => {
    try {
      const to = {
        email: toEmail,
        name: toName,
        phoneNumber: toPhoneNumber,
      };
      const from = {
        email: fromEmail,
        name: fromName,
        phoneNumber: fromPhoneNumber,
      };

      const fromValid = validateFromDetails(from);
      const toValid = validateToDetails(to);


      if (!fromValid) {
        return;
      }


      if (!toValid) {
        return;
      }

      let data = new FormData() as FormData;

      setServerStates("LOADING");

      data.append("file", fileList[0].originFileObj as RcFile);
      data.append("from", JSON.stringify(from));
      data.append("to", JSON.stringify(to));
      data.append("currency", "ZAR");
      data.append("items", JSON.stringify(items));
      data.append("invoiceDate", date);

      const response = await Invoice.createInvoice(data);
      if (!response.data.success) {
        Notification.error({
          message: response.data.message,
        });
        setServerStates("IDLE");
      } else {
        Notification.success({
          message: "Successfully create an invoice",
        });
        navigate("/invoices");
      }
    } catch (error) {
      console.log(error);
      Notification.error({
        message: "Something went wrong please try again later",
      });
      setServerStates("IDLE");
    }
  };

  return (
    <TemplateWrapper defaultIndex="2">
      <div className="wrapper">
        {serverStates === "IDLE" && (
          <>
            <div className="wrapper-invoice">
              <div className="header">
                <div className="title">
                  <span>Invoice</span>
                </div>
                <div className="logo-container">
                  <ImgCrop rotate>
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={onPreview}
                      beforeUpload={() => false}
                    >
                      {fileList.length < 1 && "+ Upload"}
                    </Upload>
                  </ImgCrop>
                </div>
              </div>
              <div className="details-container">
                <div className="details-from">
                  <div className="from">From</div>
                  <div className="name">
                    <input
                      className={`form-control  ${fromNameTouches ? (fromNameError ? "is-invalid" : "is-valid") : ""}`}
                      name="fromName"
                      placeholder="Name"
                      value={fromName}
                      onChange={(e) => setFromName(e.target.value)}
                      onBlur={() => setFromNameTouched(true)}
                    />
                  </div>
                  <div className="email">
                    <input
                      name="fromEmail"
                      type="email"
                      className={`form-control  ${fromEmailTouched ? (fromEmailError ? "is-invalid" : "is-valid") : ""}`}
                      placeholder="Email"
                      value={fromEmail}
                      onBlur={() => setFromEmailTouched(true)}
                      onChange={(e) => setFromEmail(e.target.value)}
                    />
                  </div>
                  <div className="phone-number">
                    <input
                      className={`form-control  ${fromPhoneNumberTouched ? (fromPhoneNumberError ? "is-invalid" : "is-valid") : ""}`}
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={fromPhoneNumber}
                      onBlur={() => setFromPhoneNumberTouched(true)}
                      onChange={(e) => setFromPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="details-for">
                  <div className="for">To</div>
                  <div className="name">
                    <input
                      name="forName"
                      className={`form-control  ${toNameTouched ? (toNameError ? "is-invalid" : "is-valid") : ""}`}
                      type="text"
                      placeholder="Name"
                      value={toName}
                      onBlur={() => setToNameTouched(true)}
                      onChange={(e) => setToName(e.target.value)}
                    />
                  </div>
                  <div className="email">
                    <input
                      name="forEmail"
                      className={`form-control  ${toNameTouched ? (toNameError ? "is-invalid" : "is-valid") : ""}`}
                      type="email"
                      placeholder="Email"
                      value={toEmail}
                      onBlur={() => setToEmailTouched(true)}
                      onChange={(e) => setToEmail(e.target.value)}
                    />
                  </div>
                  <div className="phone-number">
                    <input
                      name="forPhoneNumber"
                      className={`form-control  is-${toPhoneNumberTouched ? (toPhoneNumberError ? "is-invalid" : "is-valid") : ""}`}
                      type="text"
                      placeholder="Phone Number"
                      value={toPhoneNumber}
                      onBlur={() => setToPhoneNumberTouched(true)}
                      onChange={(e) => setToPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="invoice-meta">
                <div className="number">Number: [Auto Generated]</div>
                <div className="date">Date: {formatInvoiceDate(date)}</div>
              </div>
              <div className="invoice-items">
                <div className="table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Item</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((i, index) => {
                        return (
                          <tr key={index.toString()}>
                            <td scope="row">
                              <input
                                value={i.item}
                                name="item"
                                placeholder="Item"
                                className="form-control item"
                                onChange={(e) => handleChange(e, index)}
                              />
                            </td>
                            <td>
                              <input
                                value={i.price}
                                name="price"
                                placeholder="Price"
                                className="form-control price"
                                type="number"
                                step="0.1"
                                min={0}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </td>
                            <td>
                              <input
                                value={i.quantity}
                                name="quantity"
                                type="number"
                                min="1"
                                className="form-control quantity"
                                placeholder="Quantity"
                                onChange={(e) => handleChange(e, index)}
                              />
                            </td>
                            <td>
                              <input
                                defaultValue={(i.quantity * i.price).toFixed(2)}
                                value={(i.quantity * i.price).toFixed(2)}
                                name="amount"
                                type="number"
                                className="form-control amount"
                                placeholder="Amount"
                                step="0.1"
                                min={0}
                              />
                            </td>
                            <td>
                              {items.length > 1 && (
                                <Button
                                  type="primary"
                                  clickHandler={() => handleRemoveRow(index)}
                                >
                                  <DeleteOutlined
                                    style={{ color: "#fff", fontSize: 25 }}
                                  />
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="add-row">
                    <button
                      className="btn btn-primary"
                      onClick={handleAppendRows}
                    >
                      + Row
                    </button>
                  </div>
                </div>
              </div>
              <div className="sub-table">
                <div className="total">Total: ZAR {total}</div>
              </div>
            </div>
            <div className="create-invoice-button">
              <Button type="primary" clickHandler={createInvoice} disabled={false}>
                Send Invoice
              </Button>
            </div>
          </>
        )}
        {serverStates === "LOADING" && (
          <div className="loading">
            <Spin size="large" />
          </div>
        )}
      </div>
    </TemplateWrapper>
  );
}
