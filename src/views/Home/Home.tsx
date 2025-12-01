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
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import { Skeleton } from "antd/es";
import "./Home.scss";
import { Invoice } from "../../networking/invoice";
import { revenueOptions } from "./data/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

interface ChartData {
  labels: string[];
  datasets: any[];
}

export default function Home() {
  const [numberOfInvoices, setNumberOfInvoices] = React.useState(0);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [numberOfPaidInvoices, setNumberOfPaidInvoices] = React.useState(0);
  const [lineData, setLineData] = React.useState<ChartData | null>(null);
  const [pieData, setPieData] = React.useState<ChartData | null>(null);
  const [revenue, setRevenue] = React.useState<ChartData | null>(null);
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
  const [loading, setLoading] = React.useState(true);

  // Helper function to validate chart data
  const isValidChartData = (data: any): data is ChartData => {
    return (
      data &&
      Array.isArray(data.labels) &&
      Array.isArray(data.datasets) &&
      data.datasets.length > 0
    );
  };

  // Helper to transform data to Chart.js format
  const transformToChartData = (
    apiData: any,
    label: string,
    color: string,
  ): ChartData | null => {
    if (isValidChartData(apiData)) {
      return apiData;
    }

    if (apiData?.data && apiData?.labels) {
      return {
        labels: apiData.labels,
        datasets: [
          {
            label: label,
            data: apiData.data,
            backgroundColor: color,
            borderColor: color.replace("0.6", "1"),
            borderWidth: 1,
          },
        ],
      };
    }

    if (Array.isArray(apiData)) {
      const labels = apiData.map(
        (item: any) => item.label || item.month || item.name,
      );
      const values = apiData.map(
        (item: any) => item.value || item.amount || item.count || 0,
      );

      return {
        labels,
        datasets: [
          {
            label: label,
            data: values,
            backgroundColor: color,
            borderColor: color.replace("0.6", "1"),
            borderWidth: 1,
          },
        ],
      };
    }

    return null;
  };

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await Invoice.fetchInvoiceInvoiceData();

      if (!response.data.success) {
        Notification.error({
          message: "Could not fetch items",
        });
        return;
      }

      const invoices = response.data.data;

      console.log("=== API Response Debug ===");
      console.log("Full Response:", invoices);
      console.log("Revenue Data:", invoices.revenue);
      console.log("Line Data:", invoices.line);
      console.log("Pie Data:", invoices.pieChart);
      console.log("========================");

      setNumberOfInvoices(invoices.numberOfInvoices);
      setNumberOfPaidInvoices(invoices.numberOfPaidInvoices);
      setTotalRevenue(invoices.totalProfitMade);
      setNumberOfOverdueInvoice(invoices.numberOfOverdueInvoices);
      setNumberOfSubscriptions(invoices.numberOfSubscriptions);
      setRevenueIncrease(invoices.revenueChange);
      setInvoiceIncreate(invoices.invoiceChange);
      setSubscriptionChange(invoices.subscriptionsChange);

      const revenueChartData = transformToChartData(
        invoices.revenue,
        "Revenue (R)",
        "rgba(54, 162, 235, 0.6)",
      );
      if (revenueChartData) {
        setRevenue(revenueChartData);
      }

      const lineChartData = transformToChartData(
        invoices.line,
        "Invoices",
        "rgba(75, 192, 192, 0.6)",
      );
      if (lineChartData) {
        if (lineChartData.datasets[0]) {
          lineChartData.datasets[0].tension = 0.4;
          lineChartData.datasets[0].fill = true;
          lineChartData.datasets[0].borderColor = "rgb(75, 192, 192)";
          lineChartData.datasets[0].backgroundColor = "rgba(75, 192, 192, 0.1)";
          lineChartData.datasets[0].borderWidth = 3;
        }
        setLineData(lineChartData);
      }

      if (
        invoices.pieChart &&
        Array.isArray(invoices.pieChart) &&
        invoices.pieChart.length >= 3
      ) {
        setPieData({
          labels: ["Paid Invoices", "Pending", "Overdue"],
          datasets: [
            {
              label: "Invoice Status",
              data: invoices.pieChart,
              backgroundColor: [
                "rgba(52, 211, 153, 0.8)",
                "rgba(251, 191, 36, 0.8)",
                "rgba(239, 68, 68, 0.8)",
              ],
              borderColor: [
                "rgba(52, 211, 153, 1)",
                "rgba(251, 191, 36, 1)",
                "rgba(239, 68, 68, 1)",
              ],
              borderWidth: 2,
            },
          ],
        });
      } else {
        const pending =
          invoices.numberOfInvoices -
          invoices.numberOfPaidInvoices -
          invoices.numberOfOverdueInvoices;
        setPieData({
          labels: ["Paid Invoices", "Pending", "Overdue"],
          datasets: [
            {
              label: "Invoice Status",
              data: [
                invoices.numberOfPaidInvoices,
                pending,
                invoices.numberOfOverdueInvoices,
              ],
              backgroundColor: [
                "rgba(52, 211, 153, 0.8)",
                "rgba(251, 191, 36, 0.8)",
                "rgba(239, 68, 68, 0.8)",
              ],
              borderColor: [
                "rgba(52, 211, 153, 1)",
                "rgba(251, 191, 36, 1)",
                "rgba(239, 68, 68, 1)",
              ],
              borderWidth: 2,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const doughnutData = React.useMemo(
    () => ({
      labels: ["Active Subscriptions", "Available Slots"],
      datasets: [
        {
          label: "Subscriptions",
          data: [
            numberOfSubscriptions,
            Math.max(100 - numberOfSubscriptions, 0),
          ],
          backgroundColor: [
            "rgba(99, 102, 241, 0.8)",
            "rgba(229, 231, 235, 0.5)",
          ],
          borderColor: ["rgba(99, 102, 241, 1)", "rgba(229, 231, 235, 1)"],
          borderWidth: 2,
        },
      ],
    }),
    [numberOfSubscriptions],
  );

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 14,
            weight: "500" as const,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Invoice Trends Over Time",
        font: {
          size: 18,
          weight: "bold" as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const barOptions = {
    ...revenueOptions,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...revenueOptions.plugins,
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 14,
            weight: "500" as const,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            size: 13,
            weight: "500" as const,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: "Invoice Status Distribution",
        font: {
          size: 18,
          weight: "bold" as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        borderWidth: 1,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            size: 13,
            weight: "500" as const,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: "Subscription Overview",
        font: {
          size: 18,
          weight: "bold" as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        borderWidth: 1,
      },
    },
    cutout: "65%",
  };

  const InfoCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: React.ReactNode;
    description?: {
      trend: "up" | "down" | "neutral" | undefined;
      percent: number;
    };
  }> = ({ icon, title, value, description }) => (
    <Card
      style={{
        height: "100%",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
      }}
      className="stat-card"
      hoverable
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 1 }} />
      ) : (
        <div className="d-flex align-items-center">
          <div
            style={{
              fontSize: "36px",
              marginRight: "16px",
              color: "#1890ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              color: "white",
            }}
          >
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "13px",
                color: "#8c8c8c",
                fontWeight: 500,
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#262626",
                marginBottom: "4px",
              }}
            >
              {value}
            </div>
            {description && (
              <div
                style={{
                  fontSize: "12px",
                  color:
                    description.trend === "up"
                      ? "#52c41a"
                      : description.trend === "down"
                        ? "#ff4d4f"
                        : "#8c8c8c",
                  fontWeight: 500,
                }}
              >
                {description.trend === "neutral" ? null : description.trend ===
                  "down" ? (
                  <ArrowDownOutlined style={{ marginRight: "4px" }} />
                ) : (
                  <ArrowUpOutlined style={{ marginRight: "4px" }} />
                )}
                {description.percent}% from last period
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  if (loading && numberOfInvoices === 0) {
    return (
      <div className="home-container">
        <div className="container-fluid">
          <div className="row min-vh-100 align-items-center justify-content-center">
            <div className="col-auto">
              <LoadingOutlined style={{ fontSize: 40 }} spin />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="home-container"
      style={{
        background: "#f5f5f5",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
      {/* Stats Cards - Full Width Row on Top */}
      <div
        className="container-fluid"
        style={{ paddingTop: "24px", paddingBottom: "24px" }}
      >
        <div className="row g-4">
          <div className="col-12 col-sm-6 col-md-6 col-lg">
            <InfoCard
              icon={<FileTextOutlined />}
              title="Number of Invoices"
              value={numberOfInvoices}
              description={
                invoiceChange
                  ? {
                      trend: invoiceChange.trend,
                      percent: invoiceChange.percent,
                    }
                  : undefined
              }
            />
          </div>

          <div className="col-12 col-sm-6 col-md-6 col-lg">
            <InfoCard
              icon={<FileProtectOutlined />}
              title="Paid invoices"
              value={`${numberOfPaidInvoices} / ${numberOfInvoices}`}
              description={
                invoiceChange
                  ? {
                      trend: invoiceChange.trend,
                      percent: invoiceChange.percent,
                    }
                  : undefined
              }
            />
          </div>

          <div className="col-12 col-sm-6 col-md-6 col-lg">
            <InfoCard
              icon={<MoneyCollectOutlined />}
              title="Total Revenue made"
              value={`R ${totalRevenue.toLocaleString()}`}
              description={
                revenueIncrease
                  ? {
                      trend: revenueIncrease.trend,
                      percent: revenueIncrease.percent,
                    }
                  : undefined
              }
            />
          </div>

          <div className="col-12 col-sm-6 col-md-6 col-lg">
            <InfoCard
              icon={<CalendarOutlined />}
              title="Total Subscriptions"
              value={numberOfSubscriptions}
              description={
                subscriptionChange
                  ? {
                      trend: subscriptionChange.trend,
                      percent: subscriptionChange.percent,
                    }
                  : undefined
              }
            />
          </div>

          <div className="col-12 col-sm-6 col-md-6 col-lg">
            <InfoCard
              icon={<WarningOutlined />}
              title="Overdue Payments"
              value={numberOfOverdueInvoice}
            />
          </div>
        </div>
      </div>

      {/* Charts Section - Below Cards */}
      <div className="container-fluid">
        <div className="row g-4">
          {/* Revenue Bar Chart */}
          <div className="col-12 col-lg-6">
            <Card
              style={{
                height: "500px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {loading ? (
                <Skeleton active paragraph={{ rows: 6 }} />
              ) : revenue && isValidChartData(revenue) ? (
                <div style={{ height: "440px", padding: "10px" }}>
                  <Bar options={barOptions} data={revenue} />
                </div>
              ) : (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#999",
                  }}
                >
                  <p>📊 No revenue data available</p>
                  <p style={{ fontSize: "12px" }}>
                    Check browser console for data format
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Line Chart */}
          <div className="col-12 col-lg-6">
            <Card
              style={{
                height: "500px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {loading ? (
                <Skeleton active paragraph={{ rows: 6 }} />
              ) : lineData && isValidChartData(lineData) ? (
                <div style={{ height: "440px", padding: "10px" }}>
                  <Line options={lineOptions} data={lineData} />
                </div>
              ) : (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#999",
                  }}
                >
                  <p>📈 No trend data available</p>
                  <p style={{ fontSize: "12px" }}>
                    Check browser console for data format
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Pie Chart */}
          <div className="col-12 col-lg-6">
            <Card
              style={{
                height: "500px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {loading ? (
                <Skeleton active paragraph={{ rows: 6 }} />
              ) : pieData && isValidChartData(pieData) ? (
                <div
                  style={{
                    height: "440px",
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Pie options={pieOptions} data={pieData} />
                </div>
              ) : (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#999",
                  }}
                >
                  <p>🥧 No status data available</p>
                </div>
              )}
            </Card>
          </div>

          {/* Doughnut Chart */}
          <div className="col-12 col-lg-6">
            <Card
              style={{
                height: "500px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {loading ? (
                <Skeleton active paragraph={{ rows: 6 }} />
              ) : (
                <div
                  style={{
                    height: "440px",
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Doughnut options={doughnutOptions} data={doughnutData} />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
