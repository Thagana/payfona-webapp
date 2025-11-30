import { useForm, Controller } from "react-hook-form";
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
    control,
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (query.isError && id) {
    return (
      <div style={{ padding: "20px" }}>
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
    <div className="create-customer-container">
      <Card style={{ maxWidth: 500, margin: "0 auto", marginTop: 50 }}>
        <Title level={3} style={{ textAlign: "center", color: "#1890ff" }}>
          {id ? "Update Customer" : "Create Customer"}
        </Title>

        {mutation.isError && (
          <Alert
            message="Error"
            description="Failed to save customer"
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label={
              <Text>
                First Name <span style={{ color: "red" }}>*</span>
              </Text>
            }
            validateStatus={errors.firstName ? "error" : ""}
            help={errors.firstName?.message}
          >
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First Name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined />}
                  placeholder="samuel"
                  size="large"
                  status={errors.firstName ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={
              <Text>
                Last Name <span style={{ color: "red" }}>*</span>
              </Text>
            }
            validateStatus={errors.lastName ? "error" : ""}
            help={errors.lastName?.message}
          >
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Last Name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined />}
                  placeholder="mothwa"
                  size="large"
                  status={errors.lastName ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={
              <Text>
                Email <span style={{ color: "red" }}>*</span>
              </Text>
            }
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<MailOutlined />}
                  placeholder="samuelmthwa79@gmail.com"
                  size="large"
                  status={errors.email ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={
              <Text>
                Phone Number <span style={{ color: "red" }}>*</span>
              </Text>
            }
            validateStatus={errors.phoneNumber ? "error" : ""}
            help={errors.phoneNumber?.message}
          >
            <Controller
              name="phoneNumber"
              control={control}
              rules={{ required: "Phone Number is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<PhoneOutlined />}
                  placeholder="072 793 2352"
                  size="large"
                  status={errors.phoneNumber ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", gap: 10 }}>
              <Button
                onClick={() => navigate("/customers")}
                style={{ flex: 1 }}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ flex: 1 }}
                size="large"
                loading={mutation.isPending}
              >
                {id ? "Update Customer" : "Create Customer"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
