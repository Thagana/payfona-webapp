import { useForm } from "react-hook-form";
import { useMutation, QueryClient, useQuery } from "@tanstack/react-query";
import { Typography, Card, Button, Input, Form, Alert, Spin } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

import Axios from "../../../networking/adaptor";

const queryClient = new QueryClient();

import "./Customer.scss";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export default function CreateCustomer() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const query = useQuery({
    queryKey: ["customers", id],
    queryFn: async () => {
      return await Axios.get(`/customers/${id}`);
    },
    enabled: !!id,
  });

  const data = query.data?.data?.data;

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (id) {
        return await Axios.put(`/customers/${id}`, data);
      }
      return await Axios.post("/customers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigate("/customers");
    },
  });

  const onSubmit = async (data: FormData) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (id && data) {
      const { firstName, lastName, email, phoneNumber } = data;
      setValue("firstName", firstName);
      setValue("lastName", lastName);
      setValue("email", email);
      setValue("phoneNumber", phoneNumber);
    }
  }, [id, data, setValue]);

  if (query.isLoading && id) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center">
        <Spin size="large" />
      </div>
    );
  }

  if (query.isError && id) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center">
        <Alert
          message="Error"
          description="Failed to load customer data"
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div
      className="h-100 d-flex align-items-center justify-content-center"
      style={{ background: "#f5f5f5", minHeight: "100vh", padding: "20px" }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 500,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
        bodyStyle={{ padding: "32px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            {id ? "Edit Customer" : "Create Customer"}
          </Title>
        </div>

        {mutation.isError && (
          <Alert
            message="Error"
            description={mutation.error?.message || "Failed to save customer"}
            type="error"
            showIcon
            style={{ marginBottom: "24px" }}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 500,
                color: "#262626",
              }}
            >
              First Name *
            </label>
            <Input
              {...register("firstName", {
                required: "First Name is required",
                minLength: {
                  value: 2,
                  message: "First Name must be at least 2 characters",
                },
              })}
              placeholder="Enter first name"
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              size="large"
              status={errors.firstName ? "error" : ""}
            />
            {errors.firstName && (
              <Text
                type="danger"
                style={{ fontSize: "12px", display: "block", marginTop: "4px" }}
              >
                {errors.firstName.message}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 500,
                color: "#262626",
              }}
            >
              Last Name *
            </label>
            <Input
              {...register("lastName", {
                required: "Last Name is required",
                minLength: {
                  value: 2,
                  message: "Last Name must be at least 2 characters",
                },
              })}
              placeholder="Enter last name"
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              size="large"
              status={errors.lastName ? "error" : ""}
            />
            {errors.lastName && (
              <Text
                type="danger"
                style={{ fontSize: "12px", display: "block", marginTop: "4px" }}
              >
                {errors.lastName.message}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 500,
                color: "#262626",
              }}
            >
              Email *
            </label>
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="Enter email address"
              prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
              size="large"
              status={errors.email ? "error" : ""}
            />
            {errors.email && (
              <Text
                type="danger"
                style={{ fontSize: "12px", display: "block", marginTop: "4px" }}
              >
                {errors.email.message}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 500,
                color: "#262626",
              }}
            >
              Phone Number *
            </label>
            <Input
              {...register("phoneNumber", {
                required: "Phone Number is required",
                pattern: {
                  value: /^[\+]?[1-9][\d]{0,15}$/,
                  message: "Invalid phone number format",
                },
              })}
              placeholder="Enter phone number"
              prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
              size="large"
              status={errors.phoneNumber ? "error" : ""}
            />
            {errors.phoneNumber && (
              <Text
                type="danger"
                style={{ fontSize: "12px", display: "block", marginTop: "4px" }}
              >
                {errors.phoneNumber.message}
              </Text>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              type="default"
              size="large"
              onClick={() => navigate("/customers")}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={mutation.isPending}
              style={{ flex: 1 }}
            >
              {id ? "Update Customer" : "Create Customer"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
