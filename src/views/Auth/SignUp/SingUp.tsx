import * as React from "react";
import Notification from "antd/es/notification";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input/input";

import "./SignUp.scss";
import Server from "../../../networking/server";
import Input from "../../../components/common/Input";

type Inputs = {
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

export default function SingUp() {
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    getFieldState,
    formState: { errors, isValid, isDirty },
  } = useForm<Inputs>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      setLoading(true);
      const response = await Server.Auth.registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
      });
      if (!response.data.success) {
        Notification.error({
          message: response.data.message,
        });
        setLoading(false);
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
    <div className="sign-up-container">
      <div className="header">Sign Up</div>
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <Input
              label="First Name"
              register={register}
              required
              errors={errors}
              type="text"
              placeholder="First Name"
              value="firstName"
              isTouched={getFieldState("firstName").isTouched}
            />
          </div>
          <div className="form-group">
            <Input
              label="Last Name"
              register={register}
              required
              errors={errors}
              type="text"
              placeholder="Last Name"
              value="lastName"
              isTouched={getFieldState("lastName").isTouched}
            />
          </div>
          <div className="form-group">
            <Input
              label="Email"
              register={register}
              required
              errors={errors}
              type="email"
              placeholder="Email"
              value="email"
              isTouched={getFieldState("email").isTouched}
            />
          </div>
          <div className="form-group">
            <Controller
              control={control}
              name="phoneNumber"
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
                formState,
              }) => (
                <PhoneInput
                  country="ZA"
                  className={`form-control ${
                    getFieldState("phoneNumber").isTouched
                      ? errors.phoneNumber
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  name={name}
                  ref={ref}
                  error={invalid && isTouched && isDirty}
                  placeholder="Phone Number"
                />
              )}
            />
          </div>
          <div className="form-group">
            <Input
              label="Password"
              register={register}
              required
              errors={errors}
              type="password"
              placeholder="Password"
              value="password"
              isTouched={getFieldState("password").isTouched}
            />
          </div>
          <div className="form-group">
            <Link to="/login" className="link">
              Already have an account? SignIn
            </Link>
          </div>
          <div className="form-group">
            <button
              className="btn btn-primary btn-lg"
              disabled={!isValid && !isDirty}
            >
              {loading ? "Loading ..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
