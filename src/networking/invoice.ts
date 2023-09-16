import Adaptor from './adaptor';

export class Invoice {
    static fetchInvoice(param: string) {
        return Adaptor.get(`/invoice/get_unauthenticated/${param}`)
    }
    static verifyInvoice(reference: string, amount: number) {
        return Adaptor.post('/invoice/verify', {
            reference,
            amount
        })
    }
    static fetchInvoices(page: number, limit: number) {
        return Adaptor.get(`/invoice?page=${page}&limit=${limit}`);
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
    static deleteInvoice(id: string) {
        return Adaptor.delete(`/invoice/${id}`);
    }
}