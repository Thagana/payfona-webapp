import * as React from "react";
import { useNavigate } from "react-router-dom";
import Notification from "antd/es/notification";
import "./ActivateAccount.scss";
import Server from "../../../networking/server";
import OtpInput from 'react-otp-input';

type Inputs = {
  activate: string
};

export default function ActivateAccount() {
  const [loading, setLoading] = React.useState(false);
  const [otp, setOtp] = React.useState('');

  const navigate = useNavigate();
  const onSubmit = async (event: React.SyntheticEvent) => {
    try {
      event.preventDefault();
      setLoading(true);
      const response = await Server.Auth.verifyAccount(otp);
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
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group d-flex">
          <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              inputStyle={{
                width: 70,
                height: 70
              }}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
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
