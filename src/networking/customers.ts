import Axios from './adaptor';

export class Customers {
    static fetchCustomers() {
        return Axios.get('/customer');
    }
}