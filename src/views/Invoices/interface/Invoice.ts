export type InvoiceType = {
    id: number;
    status: "PENDING" | "PAID" | "DRAFT";
    total: number;
    invoiceNumber: string;
    name: string;
    email: string;
    date: string;
    invoiceId: string;
    currency: string
    createdAt: string
    paidAt: string;
    banking: {
      channel: string;
      brand: string;
      last4: string;
      bank: string
    }
  };