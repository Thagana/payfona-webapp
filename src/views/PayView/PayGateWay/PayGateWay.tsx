import * as React from 'react'
import { usePaystackPayment } from "react-paystack";
import configs from '../../../configs/config';
import { useNavigate } from 'react-router-dom';
import { Invoice } from '../../../networking/invoice';
import Notification from 'antd/es/notification';

type Props = {
  total: number;
  email: string;
  currency: string;
  invoiceGui: string;
}

export default function PayGateWay(props: Props) {
  const { email, total, currency, invoiceGui } = props;
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate()
  const config: any = {
    reference: invoiceGui,
    email,
    amount: total * 100,
    publicKey: configs.PAY_STACK_PUBLIC,
    currency,
  };

  const initializePayment = usePaystackPayment(config);
 
  const callback = async (payload: any) => {
    try {
      console.log(payload);
      const response = await Invoice.verifyInvoice(payload.reference, 100);
      if (response.data.success) {
        setLoading(false);
        navigate('/invoice')
      } else {
        setLoading(false);
        Notification.error({
          message: 'Something went wrong please try again'
        })
      }
    } catch (error) {
      console.log(error);
      Notification.error({
        message: 'Something went wrong please try again'
      })
    }
  }

  const onClose = () => {
    console.log('closed')
  }
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000)
  },[])

  if (loading) {
    return <div>Loading ...</div>
  }

  return (
    <>{     
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        initializePayment(callback, onClose)
      }
    </>
  )
}
