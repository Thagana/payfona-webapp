import { Modal } from "antd";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Notification from "antd/es/notification";
import Server from "../../../networking/server";
import OtpInput from "react-otp-input";
import "./ActivateAccount.scss";

export default function ActivateAccount(): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const navigate = useNavigate();

  const onSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (loading) return;

      setLoading(true);
      try {
        const response = await Server.Auth.verifyAccount(otp);
        const { data } = response || {};
        if (!data?.success) {
          Notification.error({ message: data?.message });
        } else {
          Notification.success({ message: data?.message });
          navigate("/login");
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        Notification.error({
          message: "Something went wrong please try again later",
        });
      } finally {
        setLoading(false);
      }
    },
    [loading, otp, navigate],
  );

  const handleCancel = React.useCallback(() => {
    setOpen(false);
  }, []);

  const openResendModalPopup = React.useCallback(() => {
    setOpen(true);
  }, []);

  const handleResendVerification = React.useCallback(async () => {
    if (confirmLoading) return;

    setConfirmLoading(true);
    try {
      const response = await Server.Auth.resendVerificationCode(email);
      const { data } = response || {};
      if (!data?.success) {
        Notification.error({ message: data?.message });
      } else {
        Notification.success({ message: data?.message });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      Notification.error({
        message: "Something went wrong please try again later",
      });
    } finally {
      setOpen(false);
      setConfirmLoading(false);
    }
  }, [confirmLoading, email]);

  return (
    <div className="activate-container">
      <header className="header">Activate Account</header>
      <div className="form-container">
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group d-flex py-2">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              inputStyle={{
                width: 70,
                height: 70,
                borderRadius: 8,
                textAlign: "center",
                border: "1px solid #d9d9d9",
              }}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
            />
          </div>
          <div className="form-group">
            <button
              type="button"
              className="btn btn-link"
              onClick={openResendModalPopup}
            >
              Resend Verification Code
            </button>
          </div>
          <div className="form-group">
            <button
              className="btn btn-primary btn-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading ..." : "Activate"}
            </button>
          </div>
        </form>
      </div>
      <Modal
        title="Resend Verification Code"
        open={open}
        onOk={handleResendVerification}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <form>
          <div className="form-group">
            <label className="label" htmlFor="resend-email">
              Email
            </label>
            <input
              id="resend-email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
