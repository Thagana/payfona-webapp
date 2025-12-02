export interface TransactionType {
  id: string;
  name: string;
  price: number;
  features: string[];
  metadata: {
    lastName: string;
    firstName: string;
    customer: {
      email: string;
      first_name: string;
      last_name: string;
    };
    payer: {
      email: string;
      firstName: string;
      lastName: string;
    };
    currency: string;
    amount: number;
    invoiceGuid: string;
    plan: {
      name: string;
      interval: string;
    };
    status: string;
    channel: string;
    authorization: {
      last4: string;
      brand: string;
    };
    reference: string;
  };
  created_at: string;
}
