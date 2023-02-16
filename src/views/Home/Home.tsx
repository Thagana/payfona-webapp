import * as React from "react";
import { useNavigate } from "react-router-dom";
import Notification from "antd/es/notification";
import Template from "../Template";
import Card from "antd/es/card";
import { FileTextOutlined, FileProtectOutlined, MoneyCollectOutlined } from "@ant-design/icons";

import "./Home.scss";
import { Invoice } from "../../networking/invoice";
import { Col, Row } from "antd/es/grid";

export default function Home() {
  const navigate = useNavigate();

  const [numberOfInvoices, setNumberOfInvoices] = React.useState(0);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [numberOfPaidInvoices, setNumberOfPaidInvoices] = React.useState(0);

  const fetchData = React.useCallback(async () => {
    try {
      const response = await Invoice.fetchInvoiceInvoiceData();
      if (!response.data.success) {
        Notification.error({
          message: "Could not fetch items",
        });
      } else {
        const invoices = response.data.data;
        setNumberOfInvoices(invoices.numberOfInvoices);
        setNumberOfPaidInvoices(invoices.numberOfPaidInvoices);
        setTotalRevenue(invoices.totalProfitMade);
      }
    } catch (error) {
      console.log(error);
      Notification.error({
        message: "Something wrong please try again",
      });
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Template defaultIndex="1">
      <div className="home-container">
        <div className="cards">
          <Card style={{ width: 300 }}>
            <Row gutter={[8, 18]}>
              <Col span={6}>
                <div className="icons">
                  <FileTextOutlined className="card-icon" color="blue" />
                </div>
              </Col>
              <Col span={18}>
                <div>
                  <div className="header">Number of Invoices</div>
                  <div className="card-body">{numberOfInvoices}</div>
                </div>
              </Col>
            </Row>
          </Card>
          <Card style={{ width: 300 }}>
            <Row gutter={[8, 18]}>
              <Col span={6}>
                <div className="icons">
                  <FileProtectOutlined className="card-icon" />
                </div>
              </Col>
              <Col span={18}>
                <div className="header">Paid invoices</div>
                <div className="card-body">
                  {numberOfPaidInvoices} / {numberOfInvoices}
                </div>
              </Col>
            </Row>
          </Card>
          <Card style={{ width: 300 }}>
            <Row gutter={[8, 18]}>
              <Col span={6}>
                <div className="icons">
                  <MoneyCollectOutlined className="card-icon" />
                </div>
              </Col>
              <Col span={18}>
                <div className="header">Total Revenue made</div>
                <div className="card-body">{totalRevenue}</div>
              </Col>
            </Row>
          </Card>
        </div>
        <div className="graphs">
          <Row>
            <Col>Left Space</Col>
            <Col>Right Space</Col>
          </Row>
        </div>
      </div>
    </Template>
  );
}
