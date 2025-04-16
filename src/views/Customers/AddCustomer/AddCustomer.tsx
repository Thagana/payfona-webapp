import { useForm } from "react-hook-form";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { Button } from 'antd';
import Axios from "../../../networking/adaptor";

const queryClient = new QueryClient();

import './AddCustomer';
import { useNavigate } from "react-router-dom";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export default function AddCustomer() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const navigation = useNavigate()
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
  };

  return (
      <div className="row">
        <div className="col-md-12">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="label">First Name</label>
          <input
            {...register("firstName")}
            type="text"
            name="firstName"
            className="form-control"
          />
          {errors.firstName && <span>First Name is required</span>}
        </div>
        <div className="form-group">
          <label className="label">Last Name</label>
          <input
            type="text"
            {...register("lastName")}
            name="lastName"
            className="form-control"
          />
          {errors.lastName && <span>Last Name is required</span>}
        </div>
        <div className="form-group">
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email")}
            name="email"
            className="form-control"
          />
          {errors.email && <span>Email is required</span>}
        </div>
        <div className="form-group">
          <label className="label">Phone Number</label>
          <input
            type="text"
            {...register("phoneNumber")}
            name="phoneNumber"
            className="form-control"
          />
          {errors.phoneNumber && <span>Phone Number is required</span>}
        </div>
        <div className="form-group">
            <Button type="primary">
              { mutation.isPending ? "Loading ..." : "Submit" }
            </Button>
        </div>
      </form>
        </div>
      </div>
  );
}
