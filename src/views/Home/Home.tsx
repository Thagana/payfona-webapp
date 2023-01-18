import * as React from "react";
import { useNavigate } from "react-router-dom";
import Template from "../Template";
import {
  ScanOutlined,
  SearchOutlined,
  LinkOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import "./Home.scss";

export default function Home() {
  const navigate = useNavigate();

  const handleClick = (to: string) => {
    switch (to) {
      case "scan":
        navigate("scan");
        break;
      case "search":
        navigate("search");
        break;
      case "link":
        navigate("get-payment-link");
        break;
      case "qrcode":
        navigate("get-qr-code");
        break;
      default:
        break;
    }
  };
  return (
    <Template defaultIndex="1">
      <div className="home-container">
        <div className="row">
          <div
            className="card"
            style={{ width: "18rem" }}
            onClick={() => {
              handleClick("scan");
            }}
          >
            <div>
              <ScanOutlined style={{ fontSize: 60 }} className="icon" />
            </div>
            <div className="header">Scan and Pay</div>
          </div>
          <div
            className="card"
            style={{ width: "18rem" }}
            onClick={() => {
              handleClick("search");
            }}
          >
            <div>
              <SearchOutlined style={{ fontSize: 60 }} className="icon" />
            </div>
            <div className="header">Search</div>
          </div>
        </div>
        <div className="row">
          <div
            className="card"
            style={{ width: "18rem" }}
            onClick={() => {
              handleClick("qrcode");
            }}
          >
            <div>
              <QrcodeOutlined style={{ fontSize: 60 }} className="icon" />
            </div>
            <div className="header">Get Paid Scan</div>
          </div>
          <div
            className="card"
            style={{ width: "18rem" }}
            onClick={() => {
              handleClick("link");
            }}
          >
            <div>
              <LinkOutlined style={{ fontSize: 60 }} className="icon" />
            </div>
            <div className="header">Payment Link</div>
          </div>
        </div>
      </div>
    </Template>
  );
}
