import Axios from './adaptor';

export class Refund {
    static fetchRefunds() {
        return Axios.get('/refund');
    }
}