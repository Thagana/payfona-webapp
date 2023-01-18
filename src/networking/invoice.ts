import Adaptor from './adaptor';

export class Invoice {
    static fetchInvoice(param: string) {
        return Adaptor.get(`/invoice?invoice_guid=${param}`)
    }
    static verifyInvoice(reference: string, amount: number) {
        return Adaptor.post('/invoice/verify', {
            reference,
            amount
        })
    }
}