import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  notification,
  Typography,
  Space,
  InputNumber,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Axios from "../../../networking/adaptor";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface RefundFormData {
  invoiceId: string;
  amount: number;
  reason: string;
  customerNote?: string;
}

export default function CreateRefund() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: (refundData: RefundFormData) =>
      Axios.post("/refund/create", refundData),
    onSuccess: (response) => {
      if (response.data.success) {
        notification.success({
          message: "Refund Created",
          description: "The refund has been created successfully and is pending processing.",
        });
        navigate("/invoice-refunds");
      } else {
        notification.error({
          message: "Failed to Create Refund",
          description: response.data.message || "Something went wrong",
        });
      }
    },
    onError: (error) => {
      notification.error({
        message: "Error Creating Refund",
        description: "Something went wrong please try again later",
      });
    },
  });

  const handleSubmit = (values: RefundFormData) => {
    mutate(values);
  };

  const handleCancel = () => {
    navigate("/invoice-refunds");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Card bordered={false}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
              style={{ marginBottom: "16px" }}
            >
              Back to Refunds
            </Button>
            <Title level={2}>Create Refund</Title>
            <Text type="secondary">
              Process a refund for a paid invoice. The refund will be initiated
              and processed according to the payment processor's policies.
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            requiredMark="optional"
          >
            <Form.Item
              label="Invoice Number"
              name="invoiceId"
              rules={[
                { required: true, message: "Please enter the invoice number" },
              ]}
              extra="Enter the invoice number or ID for the invoice you want to refund"
            >
              <Input
                placeholder="INV-001"
                size="large"
                disabled={isPending}
              />
            </Form.Item>

            <Form.Item
              label="Refund Amount"
              name="amount"
              rules={[
                { required: true, message: "Please enter the refund amount" },
                {
                  type: "number",
                  min: 0.01,
                  message: "Amount must be greater than 0",
                },
              ]}
              extra="Amount in the invoice currency (e.g., 100.00 for R100.00)"
            >
              <InputNumber
                placeholder="0.00"
                size="large"
                style={{ width: "100%" }}
                min={0}
                step={0.01}
                precision={2}
                disabled={isPending}
              />
            </Form.Item>

            <Form.Item
              label="Reason for Refund"
              name="reason"
              rules={[
                { required: true, message: "Please select a reason" },
              ]}
            >
              <Select
                placeholder="Select a reason"
                size="large"
                disabled={isPending}
                options={[
                  { value: "duplicate", label: "Duplicate Payment" },
                  { value: "fraudulent", label: "Fraudulent Transaction" },
                  { value: "requested_by_customer", label: "Requested by Customer" },
                  { value: "product_unsatisfactory", label: "Product/Service Unsatisfactory" },
                  { value: "cancelled_order", label: "Cancelled Order" },
                  { value: "overcharged", label: "Customer Overcharged" },
                  { value: "other", label: "Other" },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Customer Note (Optional)"
              name="customerNote"
              extra="Optional message to include with the refund notification"
            >
              <TextArea
                placeholder="We apologize for the inconvenience and have processed your refund..."
                rows={4}
                disabled={isPending}
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  size="large"
                  loading={isPending}
                >
                  Create Refund
                </Button>
                <Button
                  onClick={handleCancel}
                  size="large"
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <Card
            size="small"
            style={{ background: "#f0f2f5", border: "none" }}
          >
            <Title level={5}>Refund Status Information</Title>
            <Space direction="vertical" size="small">
              <Text>
                <strong>Pending:</strong> Refund initiated, waiting for processor response
              </Text>
              <Text>
                <strong>Processing:</strong> Refund received by the processor
              </Text>
              <Text>
                <strong>Needs Attention:</strong> Bank details required to proceed
              </Text>
              <Text>
                <strong>Failed:</strong> Refund failed, amount credited back
              </Text>
              <Text>
                <strong>Processed:</strong> Refund successfully processed
              </Text>
            </Space>
          </Card>
        </Space>
      </Card>
    </div>
  );
}
