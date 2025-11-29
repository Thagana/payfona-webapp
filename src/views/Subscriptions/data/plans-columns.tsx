import { Tag } from "antd/es";
import { ColumnsType } from "antd/es/table";
import { LinkOutlined } from "@ant-design/icons";
import { PlanType } from "../interface/plan.interface";

export const columns: ColumnsType<PlanType> = [
  {
    title: "Plan #",
    dataIndex: "plan_code",
    key: "planCode",
    width: "20%",
  },
  {
    title: "Plan Name",
    dataIndex: "name",
    width: "20%",
  },
  {
    title: "Interval",
    dataIndex: "interval",
    key: "interval",
    width: "40%",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    width: "20%",
  },
];
