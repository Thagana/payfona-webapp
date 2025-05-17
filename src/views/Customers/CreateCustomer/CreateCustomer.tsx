import { useForm } from "react-hook-form";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { Input, Typography, notification } from "antd";

const { Text } = Typography;

import Axios from "../../../networking/adaptor";

const queryClient = new QueryClient();

import "./CreateCustomer.scss";

import { useNavigate } from "react-router-dom";

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
    formState: { errors },
  } = useForm<FormData>();
  const navigation = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      return await Axios.post("/customer", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigation("/customers");
    },
    onError: () => {
      notification.open({
        message: "Failed to create customer",
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    mutate(data);
  };

  return (
    <div className="container-fluid create-customer">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <input
            placeholder="First Name"
            {...register("firstName", { required: true })}
            type="text"
            name="firstName"
            className="form-control"
          />
          {errors.firstName && <Text>First Name is Required</Text>}
        </div>
        <div className="form-group">
          <input
            placeholder="Last Name"
            type="text"
            {...register("lastName", { required: true })}
            name="lastName"
            className="form-control"
          />
          {errors.lastName && <span>Last Name is required</span>}
        </div>
        <div className="form-group">
          <input
            placeholder="Email"
            type="email"
            {...register("email", { required: true })}
            name="email"
            className="form-control"
          />
          {errors.email && <span>Email is required</span>}
        </div>
        <div className="form-group">
          <input
            placeholder="Phone Number"
            type="text"
            {...register("phoneNumber", { required: true })}
            name="phoneNumber"
            className="form-control"
          />
          {errors.phoneNumber && <span>Phone Number is required</span>}
        </div>
        <div className="form-group">
          <button className="btn btn-primary p-2">
            {isPending ? "Loading ..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
