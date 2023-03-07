import * as React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Notification from "antd/es/notification";

import Pagination from "antd/es/pagination";
import type { PaginationProps } from "antd/es/pagination";

import "./Invoices.scss";

import Invoices from "../../components/Invoices";
import { Invoice as FetchInvoice } from "../../networking/invoice";

import Template from "../Template";

type Invoices = {
  status: "PENDING" | "PAID" | "DRAFT";
  total: number;
  invoiceNumber: string;
  name: string;
  email: string;
  date: string;
  invoiceId: string;
};

type InvoicesProps = {
  invoices: Invoices[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
};

type InvoiceResponse = {
  success: boolean;
  message: string;
  data: InvoicesProps;
};

export default function Invoice() {
  const navigate = useNavigate();
  const [data, setData] = React.useState<InvoicesProps>();

  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);

  const fetchInvoice = async () => {
    try {
      const response = await FetchInvoice.fetchInvoices(page, limit);
      const data = response.data as InvoiceResponse;
      if (!data.success) {
        Notification.error({
          message: "Something went wrong could not fetch invoices",
        });
      } else {
        setData(data.data);
      }
    } catch (error) {
      console.error(error);
      Notification.error({
        message: "Something went wrong please try again",
      });
    }
  };
  const handleNewInvoice = () => {
    navigate("/invoice/create");
  };

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    setPage(current);
    setLimit(pageSize);
  };

  React.useEffect(() => {
    fetchInvoice();
  }, [page, limit]);

  return (
    <Template defaultIndex="2">
      <div className="home-container">
        <div className="home-header">
          <div className="header-invoice">
            <div className="header">Invoice</div>
            <div className="header-sub-text">There are 7 total invoices</div>
          </div>
          <div>
            <div className="actions">
              <div className="create-invoice">
                <button
                  className="btn btn-primary add-invoice"
                  onClick={handleNewInvoice}
                >
                  <PlusOutlined />
                  <div className="add-invoice-text">New Invoice</div>
                </button>
              </div>
            </div>
          </div>
        </div>
        {data && (
          <div className="invoices">
            <div>
              <Invoices data={data} />
            </div>
            <div className="m-2">
              <Pagination
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                defaultCurrent={page}
                onChange={(val) => {
                  setPage(val);
                }}
                total={data.totalItems}
              />
            </div>
          </div>
        )}
      </div>
    </Template>
  );
}
