import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Typography,
  Card,
  Divider,
  notification,
  Select,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SendOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Spin } from "antd";

const { Title, Text } = Typography;

import Axios from "../../../networking/adaptor";
import { InvoicePayload } from "../../../interface/InvoicePayload";
import { useNavigate, useNavigation } from "react-router-dom";
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

  const { mutate, isError, isPending, isPaused } = useMutation({
    mutationFn: (invoice: InvoicePayload) => {
      return Axios.post("/invoice/create_invoice", invoice);
    },
  });

  const handleAddItem = () => {
    setItems([...items, { description: "", price: 0, quantity: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === "description" ? (value as string) : Number(value),
    };
    setItems(newItems);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = () => {
    try {
      const invoice: InvoicePayload = {
        to: toDetails,
        from: formDetails,
        items: items,
        currency: "ZAR",
        invoiceDate: new Date().toISOString(),
        total: subtotal,
        logo: "https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4",
      };
      mutate(invoice);
      navigation("/invoices");
    } catch (error) {
      notification.open({
        message: "Something went wrong please try again later",
      });
    }
  };

  const handleChange = (value: string) => {};

  return (
    <>
      {isPending && (
        <div style={{ maxWidth: 1000, margin: "auto", padding: "2rem" }}>
          <Spin />
        </div>
      )}
      {isError && (
        <div style={{ maxWidth: 1000, margin: "auto", padding: "2rem" }}>
          Error
        </div>
      )}
      {!isPending && (
        <div style={{ maxWidth: 1000, margin: "auto", padding: "2rem" }}>
          <Row justify="space-between" align="middle">
            <Title level={3}>Create New Invoice</Title>
            <Select
              defaultValue="default"
              style={{ width: 120 }}
              onChange={handleChange}
              options={[{ value: "default", label: "Default Logo" }]}
            />
          </Row>

          <Divider />

          <Row gutter={24}>
            <Col span={12}>
              <Card bordered={false}>
                <Text type="secondary">From (Your Information)</Text>
                <Input
                  placeholder="Your name or company name"
                  className="my-2"
                  name="name"
                  type="text"
                  value={formDetails.name}
                  onChange={(value) =>
                    setFromDetails({
                      ...formDetails,
                      name: value.target.value,
                    })
                  }
                />
                <Input
                  placeholder="your.email@example.com"
                  className="my-2"
                  name="email"
                  type="email"
                  value={formDetails.email}
                  onChange={(value) =>
                    setFromDetails({
                      ...formDetails,
                      email: value.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Phone number"
                  name="phoneNumber"
                  type="text"
                  value={formDetails.phoneNumber}
                  onChange={(value) =>
                    setFromDetails({
                      ...formDetails,
                      phoneNumber: value.target.value,
                    })
                  }
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Text type="secondary">To (Client Information)</Text>
                <Input
                  placeholder="Client name or company name"
                  name="name"
                  className="my-2"
                  value={toDetails.name}
                  onChange={(value) =>
                    setToDetails({
                      ...toDetails,
                      name: value.target.value,
                    })
                  }
                />
                <Input
                  placeholder="client.email@example.com"
                  name="email"
                  type="email"
                  className="my-2"
                  value={toDetails.email}
                  onChange={(value) =>
                    setToDetails({
                      ...toDetails,
                      email: value.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Phone number"
                  type="text"
                  name="phoneNumber"
                  value={toDetails.phoneNumber}
                  onChange={(value) =>
                    setToDetails({
                      ...toDetails,
                      phoneNumber: value.target.value,
                    })
                  }
                />
              </Card>
            </Col>
          </Row>

          <Divider />

          <Row justify="space-between" align="middle">
            <Text strong>Invoice Items</Text>
            <Button icon={<PlusOutlined />} onClick={handleAddItem}>
              Add Item
            </Button>
          </Row>

          <Table
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
              key="amount"
              align="right"
              render={(_: any, item: Item, index: number) => (
                <Text>R {(item.price * item.quantity).toFixed(2)}</Text>
              )}
            />
            <Table.Column
              title=""
              key="action"
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

          <Row justify="end" style={{ marginTop: 20 }}>
            <Card style={{ width: 300 }} bordered={false}>
              <Row justify="space-between" align="middle">
                <Text>Subtotal</Text>
                <Text>R {subtotal.toFixed(2)}</Text>
              </Row>
              <Row justify="space-between" style={{ marginTop: 8 }}>
                <Text strong>Total</Text>
                <Text strong>R {subtotal.toFixed(2)}</Text>
              </Row>
            </Card>
          </Row>

          <Row justify="end" gutter={16} style={{ marginTop: 24 }}>
            <Col>
              <Button icon={<SaveOutlined />}>Save Draft</Button>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<SendOutlined />}
                style={{ padding: "0 24px" }}
                onClick={handleSubmit}
              >
                Send Invoice
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default InvoicePage;
