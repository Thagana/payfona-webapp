import * as React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Notification from 'antd/es/notification';


import "./Invoices.scss";

import Invoices from "../../components/Invoices";
import { Invoice } from "../../networking/invoice";

import Template from "../Template";

type Invoices = {
  status: 'PENDING' | 'PAID' | 'DRAFT',
  total: number;
  invoiceNumber: string;
  name: string;
  email: string;
  date: string;
  invoiceId: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [invoice, setInvoice] = React.useState<Invoices[]>([])
  const fetchInvoice = async () => {
    try {
        const response = await Invoice.fetchInvoices();
        const data = response.data;
        if (!data.success) {
          Notification.error({
            message: 'Something went wrong could not fetch invoices'
          })
        } else {
          setInvoice(data.data);
        }
    } catch (error) {
      console.error(error);
      Notification.error({
        message: 'Something went wrong please try again'
      })
    }
  }
  const handleNewInvoice = () => {
    navigate('/invoice/create')
  }
  React.useEffect(() => {
    fetchInvoice(); 
  },[]);

  return (
    <Template defaultIndex="2">
      <div className="home-container">
        <div className="home-header">
          <div className="header-invoice">
            <div className="header">Invoice</div>
            <div className="header-sub-text">There are 7 total invoices</div>
          </div>
          <div>
            <div className="actions">
              <div className="create-invoice">
                <button className="btn btn-primary add-invoice" onClick={handleNewInvoice}>
                  <PlusOutlined />
                  <div className="add-invoice-text">New Invoice</div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <Invoices invoices={invoice} />
      </div>
    </Template>
  );
}
