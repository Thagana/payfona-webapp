import * as React from "react";
import { Invoice } from "../../networking/invoice";
import NoInvoiceGui from "./NoInvoiceGui";
import PayGateWay from "./PayGateWay";

type STATES = "IDLE" | "LOADING" | "ERROR" | "SUCCESS";

type REASONS = "NETWORK_ERROR" | "NO_INVOICE_FOUND" | "UNKNOWN_ERROR";

export default function PayView() {
  const [REQUEST_STATES, setRequestStates] = React.useState<STATES>("IDLE");
  const [total, setTotal] = React.useState<number>(0);
  const [email, setEmail] = React.useState<string>('');
  const [currency, setCurrency] = React.useState<string>('');
  const [guid, setGuid] = React.useState<string>('');
  const [reason, setReason] = React.useState<REASONS>('UNKNOWN_ERROR');

  const getQueryParam = (param: string) => {
    const query = window.location.search.substring(1);
    const vars = query.split("&");

    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] == param) {
        return pair[1];
      }
    }
    return false;
  };

  const fetchInvoice = async (query: string) => {
    try {
      setRequestStates("LOADING");
      const response = await Invoice.fetchInvoice(query);
      if (!response.data.success) {
        setRequestStates("ERROR");
        setReason(response.data.message);
      } else {
        setEmail(response.data.data.email);
        setTotal(response.data.data.total);
        setCurrency(response.data.data.currency);
        setRequestStates("SUCCESS");
      }
    } catch (error) {
      setReason("NETWORK_ERROR");
      setRequestStates("ERROR");
    }
  };

  React.useEffect(() => {
    const query = getQueryParam("guid");
    if (query) {
      setGuid(query);
      fetchInvoice(query);
    }
  }, []);

  return (
    <>
      {REQUEST_STATES === "IDLE" && <div>IDLE</div>}{" "}
      {REQUEST_STATES === "SUCCESS" && <PayGateWay total={total} currency={currency} email={email} invoiceGui={guid} />}
      {REQUEST_STATES === "ERROR" && <NoInvoiceGui reason={reason} />}
      {REQUEST_STATES === "LOADING" && <div>Loading ...</div>}
    </>
  );
}
