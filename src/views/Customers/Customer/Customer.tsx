import { useForm } from "react-hook-form";
import { useMutation, QueryClient, useQuery } from "@tanstack/react-query";
import { Typography } from "antd";

const { Text } = Typography;

import Axios from "../../../networking/adaptor";

const queryClient = new QueryClient();

import "./Customer.scss";

import { useNavigate, useParams } from "react-router-dom";

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
  } = useForm<FormData>();

  const navigate = useNavigate();
  const { id } = useParams();

  const query = useQuery({
    queryKey: ["customers", id],
    queryFn: async () => {
      return await Axios.get(`/customers/${id}`);
    },
  });

  const data = query.data?.data?.data;

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
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

  if (id) {
    if (data) {
      const { firstName, lastName, email, phoneNumber } = data;
      setValue("firstName", firstName);
      setValue("lastName", lastName);
      setValue("email", email);
      setValue("phoneNumber", phoneNumber);
    }
  }

  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <div className="row">
        <div className="col-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="label">First Name</label>
              <input
                {...register("firstName")}
                type="text"
                name="firstName"
                className="form-control"
              />
              {errors.firstName && <Text>First Name is Required</Text>}
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
            <div className="row py-2">
              <div className="col-md-12">
                <button className="btn btn-primary btn-block">
                  {mutation.isPending ? "Loading ..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
