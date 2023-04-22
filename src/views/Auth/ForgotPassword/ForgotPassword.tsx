import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Notification from "antd/es/notification";
import { useNavigate } from "react-router-dom";
import Server from "../../../networking/server";

import './ForgotPassword.scss';

export default function ForgotPassword() {
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    getFieldState,
    formState: { errors, isDirty, isValid },
  } = useForm<{
    email: string
  }>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<{
    email: string
  }> = async (data: { email: string }) => {
    try {
      setLoading(true);
      const response = await Server.Auth.requestChangePassword({
        email: data.email,

      });
      if (!response.data.success) {
        Notification.error({
          message: response.data.message,
        });
        setLoading(false);
      } else {
        setLoading(false);

        Notification.success({
          message: response.data.message,
        });

        navigate("/change-password");
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
    <div className="forgot-password-request-container">
      <div className="header">Forgot Password</div>
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              className={`form-control ${
                getFieldState("email").isTouched
                  ? errors.email
                    ? "is-invalid"
                    : "is-valid"
                  : ""
              }`}
              {...register("email", {
                required: "Email is required",
                maxLength: {
                  value: 100,
                  message: "The email provided is too long",
                },
                minLength: {
                  value: 3,
                  message: "The email provided is too short",
                },
                pattern: {
                  value: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/,
                  message: "Email provided is not valid",
                },
              })}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
          <div className="form-group">
            <button
              className="btn btn-primary btn-lg"
              disabled={!isValid && !isDirty}
            >
              {loading ? "Loading ..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
