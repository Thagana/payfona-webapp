import { Customer } from "../views/Customers/model/customer.model";
import Axios from "./adaptor";

export class Customers {
  static fetchCustomers() {
    return Axios.get("/customer");
  }
  static createCustomer(data: Customer) {
    return Axios.post("/customer", {
      data,
    });
  }
}
