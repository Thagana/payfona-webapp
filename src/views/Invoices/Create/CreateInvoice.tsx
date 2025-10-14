import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Typography,
  Card,
  Divider,
  notification,
  Select,
  Form,
  message,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SendOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import Axios from "../../../networking/adaptor";
import { InvoicePayload } from "../../../interface/InvoicePayload";

const { Title, Text } = Typography;

interface Item {
  description: string;
  price: number;
  quantity: number;
}

interface Details {
  name: string;
  email: string;
  phoneNumber: string;
}

const InvoicePage = () => {
  const [items, setItems] = useState([
    { description: "", price: 0, quantity: 0 },
  ]);
  const [formDetails, setFromDetails] = useState<Details>({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [toDetails, setToDetails] = useState<Details>({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const navigation = useNavigate();
  const { mutate, isError, isPending } = useMutation({
    mutationFn: (invoice: InvoicePayload) =>
      Axios.post("/invoice/create-invoice", invoice),
  });

  const handleAddItem = () =>
    setItems([...items, { description: "", price: 0, quantity: 0 }]);
  const handleRemoveItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === "description" ? value : Number(value),
    };
    setItems(newItems);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleSubmit = () => {
    try {
      const invoice: InvoicePayload = {
        to: toDetails,
        from: formDetails,
        items,
        currency: "ZAR",
        invoiceDate: new Date().toISOString(),
        total: subtotal,
        logo: "https://placehold.co/80x80.png", // placeholder
      };
      console.log("INVOICE-INVOICE", invoice);
      const issues = [];
      if (!invoice.from.email || !invoice.from.name) {
        issues.push("Invoice sender details required");
      }
      if (!invoice.to.email || !invoice.to.name) {
        issues.push("Invoice Reciepients details required");
      }
      const hasValid = invoice.items.some(
        ({ description, price, quantity }) =>
          description !== "" || price !== 0 || quantity !== 0,
      );

      if (!hasValid) {
        issues.push("You must add atleadt one item");
      }
      console.log("ISSUES", issues);

      if (issues.length > 0) {
        issues.forEach((issue) => message.error(issue));
      }

      // mutate(invoice);
      // if (!isPending) navigation("/invoices");
    } catch {
      notification.error({
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "auto", padding: "2rem" }}>
      {isPending ? (
        <Spin size="large" style={{ display: "block", margin: "5rem auto" }} />
      ) : isError ? (
        <Text type="danger">Error loading invoice</Text>
      ) : (
        <>
          {/* Header */}
          <Row justify="space-between" align="middle">
            <Title level={3} style={{ margin: 0 }}>
              Create New Invoice
            </Title>
            <Select
              defaultValue="default"
              style={{ width: 160 }}
              options={[{ value: "default", label: "Default Logo" }]}
            />
          </Row>

          <Divider />

          {/* From & To Information */}
          <Row gutter={24}>
            <Col span={12}>
              <Card title="From (Your Information)" bordered={true}>
                <Form layout="vertical">
                  <Form.Item>
                    <Input
                      placeholder="Your name or company name"
                      value={formDetails.name}
                      onChange={(e) =>
                        setFromDetails({ ...formDetails, name: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      placeholder="your.email@example.com"
                      value={formDetails.email}
                      onChange={(e) =>
                        setFromDetails({
                          ...formDetails,
                          email: e.target.value,
                        })
                      }
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      placeholder="Phone number"
                      value={formDetails.phoneNumber}
                      onChange={(e) =>
                        setFromDetails({
                          ...formDetails,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="To (Client Information)" bordered={true}>
                <Form layout="vertical">
                  <Form.Item>
                    <Input
                      placeholder="Client name or company name"
                      value={toDetails.name}
                      onChange={(e) =>
                        setToDetails({ ...toDetails, name: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      placeholder="client.email@example.com"
                      value={toDetails.email}
                      onChange={(e) =>
                        setToDetails({ ...toDetails, email: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      placeholder="Phone number"
                      value={toDetails.phoneNumber}
                      onChange={(e) =>
                        setToDetails({
                          ...toDetails,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>

          <Divider />

          {/* Invoice Items */}
          <Row justify="space-between" align="middle">
            <Text strong>Invoice Items</Text>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddItem}
            >
              Add Item
            </Button>
          </Row>

          <Table
            bordered
            dataSource={items}
            pagination={false}
            rowKey={(_, index) => index!.toString()}
            style={{ marginTop: "1rem" }}
          >
            <Table.Column
              title="Item Description"
              dataIndex="description"
              render={(text, _, index) => (
                <Input
                  value={text}
                  placeholder="Item description"
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                />
              )}
            />
            <Table.Column
              title="Price (ZAR)"
              dataIndex="price"
              align="right"
              render={(text, _, index) => (
                <Input
                  type="number"
                  min={0}
                  value={text}
                  onChange={(e) => updateItem(index, "price", e.target.value)}
                  prefix="R"
                />
              )}
            />
            <Table.Column
              title="Quantity"
              dataIndex="quantity"
              align="right"
              render={(text, _, index) => (
                <Input
                  type="number"
                  min={0}
                  value={text}
                  onChange={(e) =>
                    updateItem(index, "quantity", e.target.value)
                  }
                />
              )}
            />
            <Table.Column
              title="Amount"
              align="right"
              render={(_, item: Item) => (
                <Text strong>R {(item.price * item.quantity).toFixed(2)}</Text>
              )}
            />
            <Table.Column
              align="center"
              render={(_, __, index) => (
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveItem(index)}
                />
              )}
            />
          </Table>

          {/* Totals */}
          <Row justify="end" style={{ marginTop: 20 }}>
            <Card
              style={{
                width: 320,
                border: "1px solid #f0f0f0",
                background: "#fafafa",
              }}
              bodyStyle={{ padding: "1rem 1.5rem" }}
            >
              <Row justify="space-between">
                <Text>Subtotal</Text>
                <Text>R {subtotal.toFixed(2)}</Text>
              </Row>
              <Divider style={{ margin: "0.75rem 0" }} />
              <Row justify="space-between">
                <Text strong>Total</Text>
                <Text strong>R {subtotal.toFixed(2)}</Text>
              </Row>
            </Card>
          </Row>

          {/* Actions */}
          <Row justify="end" gutter={16} style={{ marginTop: 24 }}>
            <Col>
              <Button icon={<SaveOutlined />}>Save Draft</Button>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSubmit}
              >
                Send Invoice
              </Button>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default InvoicePage;
