import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  notification,
  Card,
  Space,
  Typography,
  Input,
  Modal,
  Form,
  Tag
} from "antd/es";
import { PlusOutlined, RetryOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import type { SearchProps } from "antd/es/input";

import { Refund as FetchRefund } from "../../networking/refund";

const { Search } = Input;
const { Title, Text } = Typography;

interface Refund {
  id: number;
  status: string;
  definition: string;
}

interface BankDetailsFormData {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode?: string;
}

export default function InvoiceRefund() {
  const navigate = useNavigate();
  const [data, setData] = React.useState<Refund[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedRefund, setSelectedRefund] = React.useState<Refund | null>(null);
  const [form] = Form.useForm();

  const fetchRefunds = async () => {
    try {
      setLoading(true);
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
      notification.error({
        message: "Something went wrong please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRefunds();
  }, []);

  const retryRefundMutation = useMutation({
    mutationFn: (payload: { refundId: number; bankDetails: BankDetailsFormData }) =>
      FetchRefund.retryRefund(payload.refundId, payload.bankDetails),
    onSuccess: (response) => {
      if (response.data.success) {
        notification.success({
          message: "Refund Retry Submitted",
          description: "The bank details have been submitted. The refund will be processed shortly.",
        });
        setModalVisible(false);
        form.resetFields();
        fetchRefunds(); // Refresh the list
      } else {
        notification.error({
          message: "Failed to Retry Refund",
          description: response.data.message || "Something went wrong",
        });
      }
    },
    onError: (error) => {
      notification.error({
        message: "Error Retrying Refund",
        description: "Something went wrong please try again later",
      });
    },
  });

  const handleCreateRefund = React.useCallback(() => {
    navigate("/refund/create");
  }, [navigate]);

  const handleRetryRefund = React.useCallback((refund: Refund) => {
    setSelectedRefund(refund);
    setModalVisible(true);
  }, []);

  const handleModalCancel = React.useCallback(() => {
    setModalVisible(false);
    setSelectedRefund(null);
    form.resetFields();
  }, [form]);

  const handleModalSubmit = React.useCallback(
    (values: BankDetailsFormData) => {
      if (selectedRefund) {
        retryRefundMutation.mutate({
          refundId: selectedRefund.id,
          bankDetails: values,
        });
      }
    },
    [selectedRefund, retryRefundMutation],
  );

  const getStatusTag = React.useCallback((status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return <Tag color="orange">Pending</Tag>;
      case "processing":
        return <Tag color="blue">Processing</Tag>;
      case "needs-attention":
        return <Tag color="red">Needs Attention</Tag>;
      case "failed":
        return <Tag color="volcano">Failed</Tag>;
      case "processed":
        return <Tag color="green">Processed</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  }, []);

  const columns: ColumnsType<Refund> = React.useMemo(
    () => [
      {
        title: "Invoice #",
        dataIndex: "id",
        key: "id",
        width: "15%",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: "20%",
        render: (status: string) => getStatusTag(status),
      },
      {
        title: "Definition",
        dataIndex: "definition",
        key: "definition",
        width: "40%",
      },
      {
        title: "Action",
        key: "action",
        width: "25%",
        render: (_, record) => {
          const statusLower = record.status.toLowerCase();
          if (statusLower === "needs-attention") {
            return (
              <Button
                type="link"
                icon={<RetryOutlined />}
                onClick={() => handleRetryRefund(record)}
                style={{ padding: 0 }}
              >
                Provide Bank Details
              </Button>
            );
          }
          return null;
        },
      },
    ],
    [getStatusTag, handleRetryRefund],
  );

  const onSearch: SearchProps["onSearch"] = (value) => {
    // Search functionality to be implemented
  };

  return (
    <div className="refunds-container">
      <Card className="refunds-header-card" bordered={false}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <Title level={2} style={{ margin: 0, marginBottom: "16px" }}>
              Refunds
            </Title>
            <Search
              placeholder="Search refunds"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
              style={{ maxWidth: "500px" }}
            />
          </div>
          <div>
            <Space size="middle">
              <Button
                type="primary"
                size="large"
                onClick={handleCreateRefund}
                icon={<PlusOutlined />}
              >
                Create Refund
              </Button>
            </Space>
          </div>
        </div>
      </Card>

      <Card className="refunds-table-card" bordered={false}>
        <Table
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={data}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} refunds`,
          }}
        />
      </Card>

      <Modal
        title="Provide Customer Bank Details"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: "16px" }}>
          <Text type="secondary">
            This refund requires the customer's bank account details to proceed.
            Please enter the information below.
          </Text>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Account Number"
            name="accountNumber"
            rules={[
              { required: true, message: "Please enter account number" },
              {
                pattern: /^[0-9]{10,}$/,
                message: "Please enter a valid account number (at least 10 digits)"
              },
            ]}
          >
            <Input
              placeholder="1234567890"
              size="large"
              disabled={retryRefundMutation.isPending}
            />
          </Form.Item>

          <Form.Item
            label="Account Holder Name"
            name="accountName"
            rules={[
              { required: true, message: "Please enter account holder name" },
              { min: 3, message: "Name must be at least 3 characters" },
            ]}
          >
            <Input
              placeholder="John Doe"
              size="large"
              disabled={retryRefundMutation.isPending}
            />
          </Form.Item>

          <Form.Item
            label="Bank Name"
            name="bankName"
            rules={[
              { required: true, message: "Please enter bank name" },
            ]}
          >
            <Input
              placeholder="Standard Bank"
              size="large"
              disabled={retryRefundMutation.isPending}
            />
          </Form.Item>

          <Form.Item
            label="Bank Code (Optional)"
            name="bankCode"
            extra="Branch code or sort code, if applicable"
          >
            <Input
              placeholder="051001"
              size="large"
              disabled={retryRefundMutation.isPending}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={retryRefundMutation.isPending}
                size="large"
              >
                Submit Bank Details
              </Button>
              <Button
                onClick={handleModalCancel}
                disabled={retryRefundMutation.isPending}
                size="large"
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
