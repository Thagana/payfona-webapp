import { Tag } from "antd/es";
import { ColumnsType } from "antd/es/table";
import { LinkOutlined } from "@ant-design/icons";
import { SubscriptionType } from "../interface/subscription.interface";

// customer:          number;
// plan:              number;
// integration:       number;
// domain:            string;
// start:             number;
// status:            string;
// quantity:          number;
// amount:            number;
// subscription_code: string;
// email_token:       string;
// authorization:     Authorization;
// easy_cron_id:      null;
// cron_expression:   string;
// next_payment_date: Date;
// open_invoice:      null;
// id:                number;
// createdAt:         Date;
// updatedAt:         Date;

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
