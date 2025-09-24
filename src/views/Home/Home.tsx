import * as React from "react";
import { useNavigate } from "react-router-dom";
import Notification from "antd/es/notification";
import Card from "antd/es/card";
import {
  FileTextOutlined,
  FileProtectOutlined,
  MoneyCollectOutlined,
  CalendarOutlined,
  WarningOutlined,
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

import "./Home.scss";
import { Invoice } from "../../networking/invoice";
import { Col, Row } from "antd/es/grid";

import { LoadingOutlined } from "@ant-design/icons";
import { Line } from "../../interface/Line";
import { revenueOptions } from "./data/data";

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
  const [numberOfInvoices, setNumberOfInvoices] = React.useState(0);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [numberOfPaidInvoices, setNumberOfPaidInvoices] = React.useState(0);
  const [lineData, setLineData] = React.useState<Line>();
  const [pieData, setPieData] = React.useState<number[]>([]);
  const [revenue, setRevenue] = React.useState<Line>();
  const [revenueIncrease, setRevenueIncrease] = React.useState<{
    percent: number;
    trend: "up" | "down";
  } | null>(null);
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
        setRevenueIncrease(invoices.revenueChange);
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
                <Col>
                  <div className="discription">+12% from last month</div>
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
                <Col>
                  <div className="discription">+12% from last month</div>
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
                <Col>
                  {revenueIncrease ? (
                    <div className="discription">
                      {" "}
                      {revenueIncrease.trend === "down" &&
                      revenueIncrease.percent !== 0
                        ? "-"
                        : "+"}
                      {revenueIncrease.percent}% from last month
                    </div>
                  ) : null}
                </Col>
              </Row>
            </Card>
            <Card style={{ width: 500 }}>
              <Row gutter={[8, 18]}>
                <Col span={6}>
                  <div className="icons">
                    <CalendarOutlined className="card-icon" />
                  </div>
                </Col>
                <Col span={18}>
                  <div className="header">Total Subscriptions</div>
                  <div className="card-body">{totalRevenue}</div>
                </Col>
                <Col>
                  <div className="discription">+12% from last month</div>
                </Col>
              </Row>
            </Card>
            <Card style={{ width: 500 }}>
              <Row gutter={[8, 18]}>
                <Col span={6}>
                  <div className="icons">
                    <WarningOutlined className="card-icon" />
                  </div>
                </Col>
                <Col span={18}>
                  <div className="header">Overdue Payments</div>
                  <div className="card-body">{totalRevenue}</div>
                </Col>
                <Col>
                  <div className="discription">+12% from last month</div>
                </Col>
              </Row>
            </Card>
          </div>
          <Row className="mx-2 my-2">
            <Col span={12}>
              <Card>
                {revenue ? (
                  <Bar options={revenueOptions} data={revenue} />
                ) : (
                  <div>Revenue data not found</div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}
