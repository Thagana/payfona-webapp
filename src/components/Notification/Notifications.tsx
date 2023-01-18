import * as React from 'react';
import Notification from './Notification';

type Notification = {
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

type Props = {
    notifications: Notification[]
}

export default function Notifications(props: Props) {
    const { notifications } = props
  return (
    <div className='notifications-container'>
        {notifications.map(i => (<Notification key={i.id}  data={i}/>))}
    </div>
  )
}
