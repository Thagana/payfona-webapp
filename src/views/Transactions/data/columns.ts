import { Tag } from "antd/es";
import { ColumnsType } from "antd/es/table";
import { TransactionType } from "../interfaces/transactions.interface";

export const columns: ColumnsType<TransactionType> = [
  {
    title: "Transaction #",
    dataIndex: "id",
    key: "transactionId",
  },
  {
    title: "Gateway Response",
    dataIndex: ["metadata", "gateway_response"],
    key: "gatewayResponse",
  },
  {
    title: "Requested Amount",
    // handle nested data access
    dataIndex: ["metadata", "requested_amount"],
    key: "requestedAmount",
  },
  {
    title: "Channel",
    dataIndex: ["metadata", "channel"],
    key: "channel",
  },
  {
    title: "Currency",
    dataIndex: ["metadata", "currency"],
    key: "currency",
  },
  {
    title: "Status",
    dataIndex: ["metadata", "status"],
    key: "status",
    render: (value: string) => value,
  },
  {
    title: "Paid At",
    dataIndex: ["metadata", "paid_at"],
    key: "paidAt",
  },
];
