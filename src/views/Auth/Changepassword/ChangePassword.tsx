import * as React from "react";

import Notification from "antd/es/notification";
import OtpInput from "react-otp-input";

import { useNavigate } from "react-router-dom";

import Server from "../../../networking/server";
import "./ChangePassword.scss";
import { useForm } from "react-hook-form";

export default function ChangePassword() {
  const [isSecond, setIsSecond] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [password1, setPassword1] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [eyeToggle, setEyeToggle] = React.useState(false);

  const navigate = useNavigate();

  const onSubmit = async (event: React.SyntheticEvent) => {
    try {
      event.preventDefault();
      if (otp) {
        setIsSecond(true);
        return;
      }
    } catch (error) {
      console.log(error);
      Notification.error({
        message: "Something went wrong please try again later",
      });
    }
  };
  const handleSubmit = async (event: React.SyntheticEvent) => {
    try {
        event.preventDefault();
        setLoading(true);
        const response = await Server.Auth.changePassword({
          password1,
          password2,
          otp
        });
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
  }
  return (
    <div className="change-password-container">
      <header className="header">Change Password</header>
      {!isSecond ? (
        <div className="form-container">
          <form className="form" onSubmit={onSubmit}>
            <div className="form-group d-flex">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                inputStyle={{
                  width: 70,
                  height: 70,
                }}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
              />
            </div>
            <div className="form-group">
              <button className="btn btn-primary btn-lg">
                {loading ? "Loading ..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="form-container">
          <form className="form">
            <div className="form-group">
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                type="password"
                className='form-control'
                placeholder="Enter your password"
                value={password1}
                onChange={(val) => setPassword1(val.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="label">
                Confirm Password
              </label>
              <input
                type="password"
                className='form-control'
                placeholder="Enter your password"
                value={password2}
                onChange={(val) => setPassword2(val.target.value)}
              />
            </div>
            <div className="form-group">
              <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
                { loading ? 'Loading ...' : 'Submit' }
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
