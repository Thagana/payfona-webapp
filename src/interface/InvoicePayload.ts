export interface InvoicePayload {
    to: To
    from: From
    items: Item[]
    logo: string
    total: number
    invoiceDate: string
    companyNote?: string
    currency: string
  }
  
  export interface To {
    email: string
    name: string
    phoneNumber: string
  }
  
  export interface From {
    email: string
    name: string
    phoneNumber: string
  }
  
  export interface Item {
    description: string
    price: number
    quantity: number
  }
  