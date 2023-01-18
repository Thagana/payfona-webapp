import Axios from "./adaptor";
export class Auth {
  static passwordUpdateRequest(email: string) {
    return Axios.post("/auth/password_request", {
      email,
    });
  }
  static updatePassword(password: string, token: string) {
    return Axios.put("/auth/update_password", {
      password,
      token,
    });
  }
  static verifyAccount(token: string) {
    return Axios.post(
      "/auth/verify_account",
      {
        token,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  static registerUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const { firstName, lastName, email, password } = data;
    return Axios.post("/auth/register", {
      firstName,
      lastName,
      email,
      password,
    });
  }
  static updateImage(uri: string, name: string, token: string) {
    return Axios.put(
      "/user/update-image",
      {
        uri,
        name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  static async signInUser(data: { email: string; password: string }) {
    const { email, password } = data;
    return Axios.post("/auth/login", {
      email,
      password,
    });
  }
}
