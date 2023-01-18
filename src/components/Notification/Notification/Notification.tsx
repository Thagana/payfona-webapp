import * as React from 'react';
import './Notification.scss';
import { formatRelative, subDays } from 'date-fns'
type Props = {
    data: {
        id: number,
        message: string,
        type: string,
        urgency: number,
        raw: {
          date: string,
          name: string,
          image: string,
          amount: number,
          currency: string,
          displayTitle: string,
        },
        date_created: string,
    }
}

export default function Notification(props: Props) {
  const { data} = props;
  return (
    <div className='notification-single-container'>
        <div>
            <img src={data.raw.image} alt="" className='notification-image' />
        </div>
        <div className='display-container'>
            <div className='info-container'>
                <div className='name'>
                    {data.raw.name}
                </div>
                <div className='dates'>
                    {formatRelative(subDays(new Date(data.date_created), 3), new Date())}
                </div>
            </div>
            <div className='transaction'>
                <div className='currency-container'>
                    <span>{data.raw.currency}</span>
                </div>
                <div className='amount-container'>
                    <span>{data.raw.amount}</span>
                </div>
            </div>
        </div>
    </div>
  )
}
