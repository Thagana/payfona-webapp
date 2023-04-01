import * as React from "react";
import { useParams } from "react-router-dom";
import Notification from "antd/es/notification";
import { Invoice as InvoiceAdaptor } from "../../../networking/invoice";
import { motion } from "framer-motion";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

import "react-pdf/dist/esm/Page/TextLayer.css";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import type { ColumnsType } from "antd/es/table";

import "./Invoice.scss";

import TemplateWrapper from "../../Template";
import InvoiceStatus from "../../../components/InvoiceStatus";

interface DataType {
  key: string;
  item: string;
  quantity: number;
  amount: number;
  price: number;
}

interface Invoice {
  from: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  to: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  image: string;
  invoiceNumber: string;
  invoiceDate: string;
  payment_link: string;
  status?: "PAID" | "DRAFT" | "PENDING";
  items: {
    key: string;
    item: string;
    quantity: number;
    price: number;
    amount: number;
  }[];
}

type VIEW_SERVER_STATE = "IDLE" | "LOADING" | "ERROR" | "SUCCESS";

export default function Invoice() {
  let { invoiceId } = useParams();
  const [invoiceMeta, setInvoiceMeta] = React.useState<Invoice>();
  const [invoiceLink, setInvoiceLink] = React.useState<string>("");
  const [SERVER_STATES, setServerState] =
    React.useState<VIEW_SERVER_STATE>("IDLE");

  const [numPages, setNumPages] = React.useState<number>();
  const [pageNumber, setPageNumber] = React.useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const navigate = useNavigate();

  const fetchInvoice = React.useCallback(async () => {
    try {
      if (!invoiceId) {
        return;
      }
      setServerState("LOADING");
      const response = await InvoiceAdaptor.fetchInvoice(invoiceId);
      if (!response.data.success) {
        Notification.error({
          message: "Something went, could not connect",
        });
        setServerState("ERROR");
      } else {
        setInvoiceMeta(response.data.data.data);
        setInvoiceLink(response.data.data.link);
        setServerState("SUCCESS");
      }
    } catch (error) {
      setServerState("ERROR");
      Notification.error({
        message: "Something went wrong please try again later",
      });
    }
  }, [invoiceId]);

  const handleDeleteInvoice = async () => {
    try {
      const response = await InvoiceAdaptor.deleteInvoice(invoiceId || "");
      if (!response.data.success) {
        Notification.error({
          message: response.data.message,
        });
      } else {
        Notification.success({
          message: "Invoice deleted successfully",
        });
        navigate("/invoices");
      }
    } catch (error) {
      console.log(error);
      Notification.error({
        message: "Something went wrong please try again later",
      });
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      render: (_, record) => <span>{record.item}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => <span>${record.price}</span>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => (
        <span>${Number(record.quantity) * record.price}</span>
      ),
    },
  ];

  React.useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  return (
    <TemplateWrapper defaultIndex="2">
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="invoice-detail-container"
      >
        <div className="invoice-details">
          <a href="/invoices" className="back-link">
            <LeftOutlined color="#000" /> Go BACK
          </a>
          {SERVER_STATES === "ERROR" && (
            <div className="error">Error occurred</div>
          )}
          {SERVER_STATES === "LOADING" && (
            <div className="loading">Loading ...</div>
          )}
          <div className="invoice-view">
            {SERVER_STATES === "SUCCESS" && (
              <>
                <div className="invoice-header">
                  <div className="status">
                    <span className="status-text">Status</span>
                    <InvoiceStatus status={invoiceMeta?.status || "DRAFT"} />
                  </div>
                  <div className="controls">
                    <button className="edit" disabled>
                      Edit
                    </button>
                    <button className="delete" onClick={handleDeleteInvoice}>
                      Delete
                    </button>
                  </div>
                </div>
                <div className="invoice-pdf">
                  <Document
                    file={invoiceLink}
                    onLoadError={(error) => console.log(error)}
                  >
                    <Page
                      pageNumber={pageNumber}
                      onGetAnnotationsError={console.error}
                    />
                  </Document>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </TemplateWrapper>
  );
}
