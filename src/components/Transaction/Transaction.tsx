import * as React from "react";
import { formatRelative, subDays } from "date-fns";
import ReactCountryFlag from "react-country-flag";

import "./Transaction.scss";

type Props = {
  payload: {
    first_name: string;
    last_name: string;
    email: string;
    paidAt: string;
    currency: string;
    amount: number;
    location: {
      country: string;
      countryISO: string;
    };
    avatar: {
      image: string;
      username: string;
    };
  };
};

export default function Transaction(props: Props) {
  const { first_name, last_name, currency, amount, paidAt, avatar, location } =
    props.payload;
  return (
    <div className="transaction-container">
      <div>
        <img src={avatar.image} alt="" className="user-image" />
      </div>
      <div className="display-container">
        <div className="info-container">
          <div className="name">{first_name + " " + last_name}</div>
          <div className="dates">
            {formatRelative(subDays(new Date(paidAt), 3), new Date())}
          </div>
          <div className="location">
            <div className="country-name">{location.country}</div>
            <div className="country-iso">
              <ReactCountryFlag
                className="emojiFlag"
                countryCode={location.countryISO}
                svg
              />
            </div>
          </div>
        </div>
        <div className="transaction">
          <div className="currency-container">
            <span>{currency}</span>
          </div>
          <div className="amount-container">
            <span>{amount / 100}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
