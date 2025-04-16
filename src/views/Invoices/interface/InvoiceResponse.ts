import { InvoicesProps } from "./InvoiceProps";

export type InvoiceResponse = {
    success: boolean;
    message: string;
    data: InvoicesProps;
  };
  
  