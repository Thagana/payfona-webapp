import * as React from 'react'
import { usePaystackPayment } from "react-paystack";
import configs from '../../../configs/config';
import { useNavigate } from 'react-router-dom';
import { Invoice } from '../../../networking/invoice';

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
 
  const callback = (payload: any) => {
    try {
      console.log(payload);
    } catch (error) {
      console.log(error);
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
