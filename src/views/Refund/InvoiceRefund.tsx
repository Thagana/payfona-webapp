import * as React from "react";
import TemplateWrapper from "../Layout";
import { Tag, Table, Divider, Button, notification } from "antd/es";

import Checkbox from "antd/es/checkbox/Checkbox";
import { TableRowSelection } from "antd/es/table/interface";
import type { ColumnsType } from "antd/es/table";

import { Refund as FetchRefund } from "../../networking/refund";

interface Refund {
  id: number;
  status: string;
  definition: string;
}

const columns: ColumnsType<Refund> = [
  {
    title: "Invoice #",
    dataIndex: "id",
    key: "id",
    width: "10%",
  },
  {
    title: "Status",
    dataIndex: "status",
    width: "20%",
  },
  {
    title: "Definition",
    dataIndex: "definition",
    key: "definition",
    width: "20%",
  },
];

export default function InvoiceRefund() {
  const [data, setData] = React.useState<Refund[]>([]);

  const fetchRefunds = async () => {
    try {
      const response = await FetchRefund.fetchRefunds();
      const { data, success, message } = response.data;
      if (!success) {
        notification.error({
          message,
        });
      } else {
        setData(data);
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Something went wrong please try again later",
      });
    }
  };

  React.useEffect(() => {
    fetchRefunds();
  }, []);

  return (
    <div className="refunds-container">
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
      />
    </div>
  );
}
