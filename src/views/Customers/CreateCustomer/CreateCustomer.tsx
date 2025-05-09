import { useForm } from "react-hook-form";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { Input, Typography } from "antd";

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
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await Axios.post("/customer", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigation("customers");
    },
  });

  const onSubmit = async (data: FormData) => {
    mutation.mutate(data);
    navigation("/customers");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="label">First Name</label>
              <Input
                {...register("firstName")}
                type="text"
                name="firstName"
                className="form-control"
              />
              {errors.firstName && <Text>First Name is Required</Text>}
            </div>
            <div className="form-group">
              <label className="label">Last Name</label>
              <Input
                type="text"
                {...register("lastName")}
                name="lastName"
                className="form-control"
              />
              {errors.lastName && <span>Last Name is required</span>}
            </div>
            <div className="form-group">
              <label className="label">Email</label>
              <Input
                type="email"
                {...register("email")}
                name="email"
                className="form-control"
              />
              {errors.email && <span>Email is required</span>}
            </div>
            <div className="form-group">
              <label className="label">Phone Number</label>
              <Input
                type="text"
                {...register("phoneNumber")}
                name="phoneNumber"
                className="form-control"
              />
              {errors.phoneNumber && <span>Phone Number is required</span>}
            </div>
            <div className="form-group">
              <button className="btn btn-priamry">
                {mutation.isPending ? "Loading ..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
