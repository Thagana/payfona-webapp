import * as React from "react";
import './Error.scss';

type Props = {
  message: string;
};

export default function Error(props: Props) {
  const { message } = props;
  return (
    <div className="error-container">
      <div className="message">
        {message}
      </div>
      <div className="button">
        <button className="btn btn-primary">Please reload</button>
      </div>
    </div>
  );
}
