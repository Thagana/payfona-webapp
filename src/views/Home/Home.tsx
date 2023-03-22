import * as React from "react";
import { useNavigate } from "react-router-dom";
import Notification from "antd/es/notification";
import Template from "../Template";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Revenue",
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const data = {
  labels,
  datasets: [
    {
      label: "Revenue",
      data: labels.map(() => Math.floor(Math.random() * 101)),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

export const getPieData = (pie: number[]) => ({
  labels: ["PAID", "UNPAID"],
  datasets: [
    {
      label: "# of Invoices",
      data: pie,
      backgroundColor: ["rgb(0,100,0, 0.2)", "rgba(255, 99, 132, 0.5)"],
      borderColor: ["rgb(0,100,0, 1)", "rgba(255, 99, 132, 0.5)"],
      borderWidth: 1,
    },
  ],
});

export default function Home() {
  const navigate = useNavigate();

  const [numberOfInvoices, setNumberOfInvoices] = React.useState(0);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [numberOfPaidInvoices, setNumberOfPaidInvoices] = React.useState(0);
  const [lineData, setLineData] = React.useState<any[]>([]);
  const [pieData, setPieData] = React.useState<number[]>([]);

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
        setLineData(invoices.line);
        setPieData(invoices.pieChart);
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
        <>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Card>
                <Bar options={options} data={data} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Row>
                  <Col span={12}>
                    <Pie data={getPieData(pieData)} />
                  </Col>
                  <Col span={12}>
                    <header>Income Flow</header>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </>
      </div>
    </Template>
  );
}
