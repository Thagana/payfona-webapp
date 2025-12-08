import Axios from "./adaptor";

interface CreateRefundPayload {
  invoiceId: string;
  amount: number;
  reason: string;
  customerNote?: string;
}

interface BankDetails {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode?: string;
}

export class Refund {
  static fetchRefunds() {
    return Axios.get("/refund");
  }

  static createRefund(payload: CreateRefundPayload) {
    return Axios.post("/refund/create", payload);
  }

  static retryRefund(refundId: number, bankDetails: BankDetails) {
    return Axios.post(`/refund/${refundId}/retry`, bankDetails);
  }
}
