import * as React from "react";
import { useNavigate } from "react-router-dom";
import Notification from "antd/es/notification";
import Template from "../Layout";
import Card from "antd/es/card";
import {
  FileTextOutlined,
  FileProtectOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";

import "./Home.scss";
import { Invoice } from "../../networking/invoice";
import { Col, Row } from "antd/es/grid";

import { LoadingOutlined } from "@ant-design/icons";
import { Line } from "../../interface/Line";
import { options, revenueOptions } from "./data/data";
import { getPieData } from "../../helper/getPieData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export default function Home() {
  const navigate = useNavigate();

  const [numberOfInvoices, setNumberOfInvoices] = React.useState(0);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [numberOfPaidInvoices, setNumberOfPaidInvoices] = React.useState(0);
  const [lineData, setLineData] = React.useState<Line>();
  const [pieData, setPieData] = React.useState<number[]>([]);
  const [revenue, setRevenue] = React.useState<Line>();
  const [loading, setLoading] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
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
        setLineData(invoices.line);
        setPieData(invoices.pieChart);
        setRevenue(invoices.revenue);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      Notification.error({
        message: "Something wrong please try again",
      });
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {loading ? (
        <div className="home-container">
          <LoadingOutlined />
        </div>
      ) : (
        <div className="home-container">
          <div className="cards mx-2 my-2">
            <Card style={{ width: 500 }}>
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
            <Card style={{ width: 500 }}>
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
            <Card style={{ width: 500 }}>
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
          <>
            <Row gutter={[12, 12]} className="mx-2 my-2">
              <Col span={12}>
                <Card>
                  {revenue ? (
                    <Bar options={revenueOptions} data={revenue} />
                  ) : (
                    <div className="revenue-not-found">
                      Revenue data not found
                    </div>
                  )}
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Row>
                    <Col span={12}>
                      <Pie data={getPieData(pieData)} />
                    </Col>
                    <Col span={12}>
                      {lineData ? (
                        <Bar options={options} data={lineData} />
                      ) : (
                        <div>Failed to load data</div>
                      )}
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </>
        </div>
      )}
    </>
  );
}
