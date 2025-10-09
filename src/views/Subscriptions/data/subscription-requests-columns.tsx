import { ColumnsType } from "antd/es/table";
import { SubscriptionType } from "../interface/subscription.interface";
import Link from "antd/es/typography/Link";

export const columns: ColumnsType<SubscriptionType> = [
  {
    title: "Subscription #",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Payment Request Link",
    dataIndex: ["metadata", "data", "authorization_url"],
    render: (value, record) => (
      <a href={value} className="link">
        {value}
      </a>
    ),
  },
  {
    title: "Reference",
    dataIndex: ["metadata", "data", "reference"],
    key: "reference",
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "createdAt",
  },
];
