export interface SubscriptionType {
  customer: number;
  plan: number;
  integration: number;
  domain: string;
  start: number;
  status: string;
  quantity: number;
  amount: number;
  subscription_code: string;
  email_token: string;
  authorization: Authorization;
  easy_cron_id: null;
  cron_expression: string;
  next_payment_date: Date;
  open_invoice: null;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    customer: {
      first_name: string;
      last_name: string;
      email: string;
    };
    plan: {
      name: string;
      plan_code: string;
    };
    paid_at: string;
    paidAt: string;
    currency: string;
  };
}

export interface Authorization {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string;
  account_name: string;
}
