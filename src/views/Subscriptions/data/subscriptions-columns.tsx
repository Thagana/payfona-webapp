import { ColumnsType } from "antd/es/table";
import { SubscriptionType } from "../interface/subscription.interface";

export const columns: ColumnsType<SubscriptionType> = [
  {
    title: "Subscription #",
    dataIndex: "subscription_code",
    key: "subscriptionCode",
    width: "10%",
  },
  {
    title: "Customer",
    dataIndex: "customer",
    width: "20%",
  },
  {
    title: "Plan",
    dataIndex: "plan",
    key: "plan",
    width: "20%",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "20%",
    render: (value: string) => value,
  },
  {
    title: "Amount",
    dataIndex: "total",
    key: "total",
    width: "20%",
  },
];
