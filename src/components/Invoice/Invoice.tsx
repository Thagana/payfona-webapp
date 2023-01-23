import * as React from "react";
import { RightOutlined } from '@ant-design/icons'
import './Invoice.scss';
import InvoiceStatus from "../InvoiceStatus";

export default function Invoice() {
  return (
    <a href="/invoice/12312" className="invoice">
      <div className="invoice-number">#INV12323</div>
      <div className="invoice-date">Due 20 Sep 2023</div>
      <div className="invoice-name">Alex Grim</div>
      <div className="invoice-total">R 203.02</div>
      <div className="invoice-status">
        <InvoiceStatus status="PENDING"/>
        <RightOutlined />
      </div>
    </a>
  );
}
