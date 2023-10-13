export interface Transact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  metadata: null;
  customer_code: string;
  risk_action: string;
  paidAt: string;
  location: {
    country: string;
    countryISO: string;
  };
  currency: string;
  amount: number;
  profile: string;
  avatar: {
    image: string;
    username: string;
  };
}
