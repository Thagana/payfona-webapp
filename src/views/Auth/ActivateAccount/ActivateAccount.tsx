import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Notification from "antd/es/notification";
import Input from "../../../components/common/Input";
import "./ActivateAccount.scss";
import Server from "../../../networking/server";

type Inputs = {
  activate: string;
};

export default function ActivateAccount() {
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      setLoading(true);
      const response = await Server.Auth.verifyAccount(data.activate);
      if (!response.data.success) {
        setLoading(false);
        Notification.error({
          message: response.data.message,
        });
      } else {
        setLoading(false);
        navigate("/login");
        Notification.success({
          message: response.data.message,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      Notification.error({
        message: "Something went wrong please try again later",
      });
    }
  };
  return (
    <div className="activate-container">
      <header className="header">Activate Account</header>
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <Input
              type="text"
              register={register}
              required
              errors={errors}
              label="Activate"
              placeholder="Enter OTP Code"
              value="activate"
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-lg">
              {loading ? "Loading ..." : "Activate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
