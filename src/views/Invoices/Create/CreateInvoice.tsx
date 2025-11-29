import { useState } from "react";
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

interface ValidationErrors {
  from?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  };
  to?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  };
  items?: string[];
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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  const navigation = useNavigate();
  const { mutate, isError, isPending } = useMutation({
    mutationFn: (invoice: InvoicePayload) =>
      Axios.post("/invoice/create-invoice", invoice),
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateDetails = (
    details: Details,
    type: "from" | "to",
  ): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};

    if (!details.name.trim()) {
      errors.name = `${type === "from" ? "Your" : "Client"} name is required`;
    }

    if (!details.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(details.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (details.phoneNumber && !validatePhoneNumber(details.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number";
    }

    return errors;
  };

  const validateItems = (): string[] => {
    const errors: string[] = [];

    const validItems = items.filter(
      (item) =>
        item.description.trim() !== "" || item.price > 0 || item.quantity > 0,
    );

    if (validItems.length === 0) {
      errors.push(
        "At least one item with description, price, and quantity is required",
      );
      return errors;
    }

    validItems.forEach((item, index) => {
      if (!item.description.trim()) {
        errors.push(`Item ${index + 1}: Description is required`);
      }
      if (item.price <= 0) {
        errors.push(`Item ${index + 1}: Price must be greater than 0`);
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
    });

    return errors;
  };

  const handleAddItem = () =>
    setItems([...items, { description: "", price: 0, quantity: 0 }]);

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

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
      // Clear previous validation errors
      setValidationErrors({});

      const fromErrors = validateDetails(formDetails, "from");
      const toErrors = validateDetails(toDetails, "to");
      const itemErrors = validateItems();

      const newValidationErrors: ValidationErrors = {};

      if (Object.keys(fromErrors).length > 0) {
        newValidationErrors.from = fromErrors;
      }

      if (Object.keys(toErrors).length > 0) {
        newValidationErrors.to = toErrors;
      }

      if (itemErrors.length > 0) {
        newValidationErrors.items = itemErrors;
      }

      if (Object.keys(newValidationErrors).length > 0) {
        setValidationErrors(newValidationErrors);

        // Show error messages
        Object.values(fromErrors).forEach((error) => message.error(error));
        Object.values(toErrors).forEach((error) => message.error(error));
        itemErrors.forEach((error) => message.error(error));

        return;
      }

      const invoice: InvoicePayload = {
        to: toDetails,
        from: formDetails,
        items: items.filter(
          (item) =>
            item.description.trim() !== "" ||
            item.price > 0 ||
            item.quantity > 0,
        ),
        currency: "ZAR",
        invoiceDate: new Date().toISOString(),
        total: subtotal,
        logo: "https://placehold.co/80x80.png", // placeholder
      };

      mutate(invoice, {
        onSuccess: () => {
          message.success("Invoice sent successfully!");
          navigation("/invoices");
        },
        onError: () => {
          message.error("Failed to send invoice. Please try again.");
        },
      });
    } catch (error) {
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
              <Card
                title="From (Your Information)"
                style={{ border: "1px solid #d9d9d9" }}
              >
                <Form layout="vertical">
                  <Form.Item
                    validateStatus={validationErrors.from?.name ? "error" : ""}
                    help={validationErrors.from?.name}
                  >
                    <Input
                      placeholder="Your name or company name"
                      value={formDetails.name}
                      onChange={(e) =>
                        setFromDetails({ ...formDetails, name: e.target.value })
                      }
                      status={validationErrors.from?.name ? "error" : ""}
                    />
                  </Form.Item>
                  <Form.Item
                    validateStatus={validationErrors.from?.email ? "error" : ""}
                    help={validationErrors.from?.email}
                  >
                    <Input
                      placeholder="your.email@example.com"
                      value={formDetails.email}
                      onChange={(e) =>
                        setFromDetails({
                          ...formDetails,
                          email: e.target.value,
                        })
                      }
                      status={validationErrors.from?.email ? "error" : ""}
                    />
                  </Form.Item>
                  <Form.Item
                    validateStatus={
                      validationErrors.from?.phoneNumber ? "error" : ""
                    }
                    help={validationErrors.from?.phoneNumber}
                  >
                    <Input
                      placeholder="Phone number"
                      value={formDetails.phoneNumber}
                      onChange={(e) =>
                        setFromDetails({
                          ...formDetails,
                          phoneNumber: e.target.value,
                        })
                      }
                      status={validationErrors.from?.phoneNumber ? "error" : ""}
                    />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title="To (Client Information)"
                style={{ border: "1px solid #d9d9d9" }}
              >
                <Form layout="vertical">
                  <Form.Item
                    validateStatus={validationErrors.to?.name ? "error" : ""}
                    help={validationErrors.to?.name}
                  >
                    <Input
                      placeholder="Client name or company name"
                      value={toDetails.name}
                      onChange={(e) =>
                        setToDetails({ ...toDetails, name: e.target.value })
                      }
                      status={validationErrors.to?.name ? "error" : ""}
                    />
                  </Form.Item>
                  <Form.Item
                    validateStatus={validationErrors.to?.email ? "error" : ""}
                    help={validationErrors.to?.email}
                  >
                    <Input
                      placeholder="client.email@example.com"
                      value={toDetails.email}
                      onChange={(e) =>
                        setToDetails({ ...toDetails, email: e.target.value })
                      }
                      status={validationErrors.to?.email ? "error" : ""}
                    />
                  </Form.Item>
                  <Form.Item
                    validateStatus={
                      validationErrors.to?.phoneNumber ? "error" : ""
                    }
                    help={validationErrors.to?.phoneNumber}
                  >
                    <Input
                      placeholder="Phone number"
                      value={toDetails.phoneNumber}
                      onChange={(e) =>
                        setToDetails({
                          ...toDetails,
                          phoneNumber: e.target.value,
                        })
                      }
                      status={validationErrors.to?.phoneNumber ? "error" : ""}
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

          {validationErrors.items && (
            <div style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
              {validationErrors.items.map((error, index) => (
                <Text
                  key={index}
                  type="danger"
                  style={{ display: "block", fontSize: "12px" }}
                >
                  {error}
                </Text>
              ))}
            </div>
          )}

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
                  step="0.01"
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
                  disabled={items.length === 1}
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
                padding: "1rem 1.5rem",
              }}
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
                disabled={isPending}
                loading={isPending}
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
