import * as React from "react";
import TemplateWrapper from "../../Template";
import Upload from "antd/es/upload";
import ImgCrop from "antd-img-crop";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

import "./CreateInvoice.scss";

export default function CreateInvoice() {
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [price, setPrice] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [quantity, setQuantity] = React.useState<number>(0);
  const [item, setItem] = React.useState("");

  const [items, setItems] = React.useState([
    { item: "", price: 0, quantity: 0, amount: 0 },
  ]);

  const [date] = React.useState(() => {
    return new Date().toISOString();
  });

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const getTotal = (_amount: string) => {
    const final = parseFloat(_amount);
    return final;
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const temp = [...items]
    temp[index][name] = value;
    setItems([...temp]);
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
  return (
    <TemplateWrapper defaultIndex="2">
      <div className="wrapper">
        <div className="wrapper-invoice">
          <div className="header">
            <div className="title">
              <span>Invoice</span>
            </div>
            <div className="logo-container">
              <ImgCrop rotate>
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
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
                  className="form-control"
                  name="fromName"
                  placeholder="Name"
                />
              </div>
              <div className="email">
                <input
                  name="fromEmail"
                  type="email"
                  className="form-control"
                  placeholder="Email"
                />
              </div>
              <div className="phone-number">
                <input
                  className="form-control"
                  name="phoneNumber"
                  placeholder="Phone Number"
                />
              </div>
            </div>
            <div className="details-for">
              <div className="for">For</div>
              <div className="name">
                <input
                  name="forName"
                  className="form-control"
                  type="text"
                  placeholder="Name"
                />
              </div>
              <div className="email">
                <input
                  name="forEmail"
                  className="form-control"
                  type="email"
                  placeholder="Email"
                />
              </div>
              <div className="phone-number">
                <input
                  name="forPhoneNumber"
                  className="form-control"
                  type="text"
                  placeholder="Phone Number"
                />
              </div>
            </div>
          </div>
          <div className="invoice-meta">
            <div className="number">Number: [Auto Generated]</div>
            <div className="date">Date: {date}</div>
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
                            value={i.amount}
                            name="amount"
                            type="number"
                            className="form-control amount"
                            placeholder="Amount"
                            step="0.1"
                            onChange={(e) => handleChange(e, index)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="add-row">
                <button className="btn btn-primary" onClick={handleAppendRows}>
                  + Row
                </button>
              </div>
            </div>
          </div>
          <div className="sub-table">
            <div className="total">Total: ZAR {getTotal(amount)}</div>
          </div>
        </div>
      </div>
    </TemplateWrapper>
  );
}
