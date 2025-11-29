import Axios from "./adaptor";
export class Auth {
  static passwordUpdateRequest(email: string) {
    return Axios.post("/auth/password-request", {
      email,
    });
  }
  static updatePassword(password: string, token: string) {
    return Axios.put("/auth/update-password", {
      password,
      token,
    });
  }
  static verifyAccount(token: string) {
    return Axios.post(
      "/auth/verify-account",
      {
        token,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  static registerUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    businessName: string;
  }) {
    const { firstName, lastName, email, password, phoneNumber, businessName } =
      data;
    return Axios.post("/auth/register", {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      businessName,
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
      },
    );
  }
  static async signInUser(data: { email: string; password: string }) {
    const { email, password } = data;
    return Axios.post("/auth/login", {
      email,
      password,
    });
  }
  static async requestChangePassword(data: { email: string }) {
    const { email } = data;
    return Axios.post("/auth/password-request", {
      email,
    });
  }
  static async changePassword(data: {
    password1: string;
    password2: string;
    otp: string;
  }) {
    const { password1, password2, otp } = data;
    return Axios.post("/auth/update-password", {
      password: password1,
      password1: password2,
      token: otp,
    });
  }
  static async resendVerificationCode(email: string) {
    return Axios.post("/auth/resend-verification-code", {
      email,
    });
  }
}
