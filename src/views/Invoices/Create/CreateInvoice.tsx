import * as React from "react";
import TemplateWrapper from "../../Template";
import Upload from "antd/es/upload";
import ImgCrop from "antd-img-crop";
import Notification from "antd/es/notification";
import { DeleteOutlined } from "@ant-design/icons";
import Button from "../../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import Modal from "antd/es/modal/Modal";

import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { formatInvoiceDate } from "../../../helper/formatInvoiceDate";

import "./CreateInvoice.scss";
import { Invoice } from "../../../networking/invoice";
import { useStoreState } from "easy-peasy";
import { Model } from "../../../store/model";

type STATES = "LOADING" | "SUCCESS" | "ERROR" | "IDLE";

type Inputs = {
  // From Details
  fromName: string;
  fromEmail: string;
  fromPhoneNumber: string;
  // For Details
  forName: string;
  forEmail: string;
  forPhoneNumber: string;
  date: string;
  image: RcFile;
};

export default function CreateInvoice() {
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [total, setTotal] = React.useState(0);
  const [isAllValid, setAllValid] = React.useState(false);
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

  const [toEmail, setToEmail] = React.useState("");
  
  const [toPhoneNumber, setToPhoneNumber] = React.useState("");

  const [errors, setErrors] = React.useState<{
    fromName: boolean;
    fromEmail: boolean;
    fromPhoneNumber: boolean;
    forName: boolean;
    forEmail: boolean;
    forPhoneNumber: boolean;
  }>();

  const [items, setItems] = React.useState([
    { item: "", price: 0, quantity: 0, amount: 0 },
  ]);

  const [date] = React.useState(() => {
    return new Date().toISOString();
  });

  const navigate = useNavigate();
  
  const accounts = useStoreState<Model>((state) => state.accounts);

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

  const onSubmit = async () => {
    try {

      let data = new FormData() as FormData;

      
      // Validate if the image has been set
      if (fileList.length === 0) {
        Notification.error({
          message: "Please select an image",
          description: "You need to select an image",
        })
        return;
      }

      setServerStates("LOADING");

      const from = {
        name: fromName,
        email: fromEmail,
        phoneNumber: fromPhoneNumber,
      };

      const to = {
        name: toName,
        email: toEmail,
        phoneNumber: toPhoneNumber,
      };

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
        navigate("/invoice-url", { state: { url: response.data.data } });
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
          <form>
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
                      className={`form-control  ${
                        errors?.fromName && "in-valid"
                      }`}
                      type="text"
                      name="fromName"
                      value={fromName}
                      onChange={(e) => setFromName(e.target.value)}
                      placeholder="Name"
                    />
                  </div>
                  <div className="email">
                    <input
                      type="email"
                      className={`form-control  ${
                        errors?.fromEmail && "in-valid"
                      }`}
                      name="fromEmail"
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      placeholder="Email"
                    />
                  </div>
                  <div className="phone-number">
                    <input
                      className={`form-control  ${
                        errors?.fromPhoneNumber && "in-valid"
                      }`}
                      type="text"
                      name="fromPhoneNumber"
                      value={fromPhoneNumber}
                      onChange={(e) => setFromPhoneNumber(e.target.value)}
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                <div className="details-for">
                  <div className="for">To</div>
                  <div className="name">
                    <input
                      name="forName"
                      className={`form-control  ${
                        errors?.forName && "in-valid"
                      }`}
                      type="text"
                      placeholder="Name"
                      value={toName}
                      onChange={(e) => setToName(e.target.value)}
                    />
                  </div>
                  <div className="email">
                    <input
                      name="forEmail"
                      className={`form-control  ${
                        errors?.forEmail && "in-valid"
                      }`}
                      type="email"
                      placeholder="Email"
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                    />
                  </div>
                  <div className="phone-number">
                    <input
                      name="forPhoneNumber"
                      className={`form-control  is-${
                        errors?.forPhoneNumber && "in-valid"
                      }`}
                      type="text"
                      placeholder="Phone Number"
                      value={toPhoneNumber}
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
                                name="item"
                                placeholder="Item"
                                className="form-control item"
                                onChange={(e) => handleChange(e, index)}
                              />
                            </td>
                            <td>
                              <input
                                value={i.price}
                                placeholder="Price"
                                name="price"
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
                                type="number"
                                className="form-control amount"
                                placeholder="Amount"
                                step="0.1"
                                defaultValue={(i.quantity * i.price).toFixed(2)}
                                value={(i.quantity * i.price).toFixed(2)}
                                min={0}
                                readOnly
                              />
                            </td>
                            <td>
                              {items.length > 1 && (
                                <Button
                                  type="button"
                                  state="primary"
                                  onClick={() => handleRemoveRow(index)}
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
              <Button
                onClick={onSubmit}
                type="button"
                state="primary"
                size="medium"
              >
                Send Invoice
              </Button>
            </div>
          </form>
        )}
        {serverStates === "LOADING" && (
          <div className="loading">
            <Spin size="large" />
          </div>
        )}
      </div>
      <Modal 
          onCancel={() => {
            navigate('/accounts/create');
          }}
          onOk={() => {
            navigate('/accounts/create');
          }}
          open={accounts.length === 0 ? true: false}>
          <div className="modal-content">
            You have not yet linked your bank account to receive the invoice money.
          </div>
      </Modal>
    </TemplateWrapper>
  );
}
