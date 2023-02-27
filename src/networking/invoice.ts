import Adaptor from './adaptor';

export class Invoice {
    static fetchInvoice(param: string) {
        return Adaptor.get(`/invoice/${param}`)
    }
    static verifyInvoice(reference: string, amount: number) {
        return Adaptor.post('/invoice/verify', {
            reference,
            amount
        })
    }
    static fetchInvoices() {
        return Adaptor.get('/invoice');
    }
    static fetchInvoiceInvoiceData() {
        return Adaptor.get('/invoice/dashboard');
    }
    static createInvoice(data: FormData) {
        return Adaptor.post('/invoice/create_invoice', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}