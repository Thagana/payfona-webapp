import * as React from "react";
import Notification from "antd/es/notification";
import Card from "antd/es/card";
import {
  FileTextOutlined,
  FileProtectOutlined,
  MoneyCollectOutlined,
  CalendarOutlined,
  WarningOutlined,
  LoadingOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
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
import { Col, Row, Skeleton } from "antd/es"; // Skeleton added
import "./Home.scss";
import { Invoice } from "../../networking/invoice";
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
  const [numberOfOverdueInvoice, setNumberOfOverdueInvoice] = React.useState(0);
  const [numberOfSubscriptions, setNumberOfSubscriptions] = React.useState(0);
  const [invoiceChange, setInvoiceIncreate] = React.useState<{
    percent: number;
    trend: "up" | "down" | "neutral";
  } | null>(null);
  const [revenueIncrease, setRevenueIncrease] = React.useState<{
    percent: number;
    trend: "up" | "down" | "neutral";
  } | null>(null);
  const [subscriptionChange, setSubscriptionChange] = React.useState<{
    percent: number;
    trend: "up" | "down" | "neutral";
  } | null>(null);
  const [loading, setLoading] = React.useState(true); // default true (first load)

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
        setInvoiceIncreate(invoices.invoiceChange);
        setNumberOfOverdueInvoice(invoices.numberOfOverdueInvoices);
        setNumberOfSubscriptions(invoices.numberOfSubscriptions);
        setSubscriptionChange(invoices.subscriptionsChange);
      }
    } catch (error) {
      console.log(error);
      Notification.error({
        message: "Something wrong please try again",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Card wrapper with skeleton
  const InfoCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: React.ReactNode;
    description?: {
      trend: "up" | "down" | "neutral" | undefined;
      percent: number;
    };
  }> = ({ icon, title, value, description }) => (
    <Card style={{ width: 500 }}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 1 }} />
      ) : (
        <Row gutter={[8, 18]}>
          <Col span={6}>
            <div className="icons">{icon}</div>
          </Col>
          <Col span={18}>
            <div className="header">{title}</div>
            <div className="card-body">{value}</div>
          </Col>
          <Col>
            <div className="discription">
              {description ? (
                <Description
                  trend={description.trend}
                  percent={description.percent}
                />
              ) : null}
            </div>
          </Col>
        </Row>
      )}
    </Card>
  );

  const Description = ({
    trend,
    percent,
  }: {
    trend: "up" | "down" | "neutral" | undefined;
    percent: number;
  }) => (
    <div className="discription">
      {trend === "neutral" ? null : trend === "down" ? (
        <ArrowDownOutlined />
      ) : (
        <ArrowUpOutlined />
      )}
      {percent}%
    </div>
  );

  // First load guard: show a centered loader until first fetch completes
  if (loading && numberOfInvoices === 0) {
    return (
      <div className="home-container">
        <LoadingOutlined style={{ fontSize: 40 }} spin />
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="cards mx-2 my-2">
        <InfoCard
          icon={<FileTextOutlined className="card-icon" />}
          title="Number of Invoices"
          value={numberOfInvoices}
          description={{
            trend: invoiceChange?.trend,
            percent: invoiceChange?.percent || 0,
          }}
        />

        <InfoCard
          icon={<FileProtectOutlined className="card-icon" />}
          title="Paid invoices"
          value={`${numberOfPaidInvoices} / ${numberOfInvoices}`}
          description={{
            trend: invoiceChange?.trend,
            percent: invoiceChange?.percent || 0,
          }}
        />

        <InfoCard
          icon={<MoneyCollectOutlined className="card-icon" />}
          title="Total Revenue made"
          value={totalRevenue}
          description={revenueIncrease || { trend: "up", percent: 0 }}
        />

        <InfoCard
          icon={<CalendarOutlined className="card-icon" />}
          title="Total Subscriptions"
          value={numberOfSubscriptions}
          description={subscriptionChange || { trend: "up", percent: 0 }}
        />

        <InfoCard
          icon={<WarningOutlined className="card-icon" />}
          title="Overdue Payments"
          value={numberOfOverdueInvoice}
        />
      </div>

      <Row className="mx-2 my-2">
        <Col span={12}>
          <Card>
            {loading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : revenue ? (
              <Bar options={revenueOptions} data={revenue} />
            ) : (
              <div>Revenue data not found</div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
