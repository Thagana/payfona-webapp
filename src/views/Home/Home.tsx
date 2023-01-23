import * as React from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DropdownButton from "../../components/Dropdown/Dropdown";
import Template from "../Template";
import "./Home.scss";
import Invoices from "../../components/Invoices";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Template defaultIndex="1">
      <div className="home-container">
        <div className="home-header">
          <div className="header-invoice">
            <div className="header">Invoice</div>
            <div className="header-sub-text">There are 7 total invoices</div>
          </div>
          <div>
            <div className="actions">
              <div className="create-invoice">
                <button className="btn btn-primary add-invoice">
                  <PlusCircleOutlined />
                  <div className="add-invoice-text">New Invoice</div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <Invoices />
      </div>
    </Template>
  );
}
