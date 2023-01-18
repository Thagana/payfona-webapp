import Axios from "./adaptor";

export class Users {
  static getNotification() {
    return Axios.get("/users/notifications");
  }

  static fetchUser() {
    return Axios.get("/users");
  }

  static getTransactions() {
    return Axios.get("/users/transactions");
  }

  static updateProfileImage(data: FormData) {
    return Axios.put('/users/update-image',data)
  }
  static updateProfile(data: { firstName: string, lastName: string }) {
    return Axios.put("/users/update", {
      firstName: data.firstName,
      lastName: data.lastName,
    });
  }
}
