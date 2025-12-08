import * as React from "react";
import { usePaystackPayment } from "react-paystack";
import configs from "../../../configs/config";
import { useNavigate } from "react-router-dom";
import { Invoice } from "../../../networking/invoice";
import Notification from "antd/es/notification";

type Props = {
  total: number;
  email: string;
  currency: string;
  invoiceGui: string;
};

interface PaystackConfig {
  reference: string;
  email: string;
  amount: number;
  publicKey: string;
  currency: string;
}

interface PaystackResponse {
  reference: string;
  trans?: string;
  status?: string;
  message?: string;
}

export default function PayGateWay(props: Props) {
  const { email, total, currency, invoiceGui } = props;
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const config: PaystackConfig = {
    reference: invoiceGui,
    email,
    amount: total * 100,
    publicKey: configs.PAY_STACK_PUBLIC,
    currency,
  };

  const initializePayment = usePaystackPayment(config);

  const callback = async (payload: PaystackResponse) => {
    try {
      const response = await Invoice.verifyInvoice(payload.reference, 100);
      if (response.data.success) {
        setLoading(false);
        navigate("/invoice");
      } else {
        setLoading(false);
        Notification.error({
          message: "Something went wrong please try again",
        });
      }
    } catch (error) {
      Notification.error({
        message: "Something went wrong please try again",
      });
    }
  };

  const onClose = () => {
    // Payment modal closed
  };
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      {initializePayment(callback as () => void, onClose) as React.ReactNode}
    </>
  );
}
