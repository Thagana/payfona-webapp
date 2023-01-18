import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Notification from "antd/es/notification";
import { Link } from "react-router-dom";
import { useStoreActions } from "easy-peasy";
import {
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import Input from "../../../components/common/Input";
import Server from "../../../networking/server";
import { Model } from "../../../store/model";
import "./SignIn.scss";

type Inputs = {
  email: string;
  password: string;
};

export default function SignIn() {
  const [loading, setLoading] = React.useState(false);
  const [eyeToggle, setEyeToggle] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const saveToken = useStoreActions<Model>((actions) => actions.saveToken);
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      setLoading(true);
      const response = await Server.Auth.signInUser({
        email: data.email,
        password: data.password,
      });
      if (!response.data.success) {
        Notification.error({
          message: response.data.message,
        });
        setLoading(false);
      } else {
        setLoading(false);
        const token = response.data.data.token;
        saveToken({ token, profile: response.data.data.profile });
        localStorage.setItem("authToken", token);
        Notification.success({
          message: response.data.message,
        });
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      Notification.error({
        message: "Something went wrong please try again later",
      });
    }
  };

  const handleToggleEye = () => {
    setEyeToggle(!eyeToggle);
  }

  return (
    <div className="log-in-container">
      <div className="header">Sign Up</div>
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : 'is-valid'}`}
              {...register('email', {
                required: 'Email is required',
                maxLength: {
                  value: 100,
                  message: "The email provided is too long"
                },
                minLength: {
                  value: 3,
                  message: "The email provided is too short"
                },
                pattern: {
                  value: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/,
                  message: "Email provided is not valid"
                }
              })
              }
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="input-group">
              <input
                type={eyeToggle ? "text" : "password"}
                className={`form-control is-form ${errors.password ? 'is-invalid' : 'is-valid'}`}
                {...register('password', {
                  required: 'Password is required',
                  maxLength: {
                    value: 100,
                    message: "The password provided is too long"
                  },
                  minLength: {
                    value: 8,
                    message: "The password provided is too short"
                  }
                })}
                placeholder="Enter your password"
              />
              <span className="input-group-text">
                {eyeToggle ? (<EyeInvisibleOutlined className="icon" onClick={handleToggleEye} />) : <EyeOutlined className="icon" onClick={handleToggleEye} />}
              </span>
            </div>
          </div>
          <div className="invalid-feedback">{errors.password?.message || ""}</div>
          <div className="form-group">
            <Link to="/register" className="link">
              Don&apos;t have an account? Sign Up
            </Link>
          </div>
          <div className="form-group">
            <Link to="/activate" className="link">
              Need to activate account? Verify
            </Link>
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-lg">
              {loading ? "Loading ..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
