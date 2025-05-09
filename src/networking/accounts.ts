import Axios from "./adaptor";

export default class Accounts {
  static async getListedBanks(token: string) {
    return await Axios.get("/accounts/external-verified", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  static async createBankAccount(
    token: string,
    accountNumber: string,
    code: string,
  ) {
    return await Axios.post(
      "/accounts",
      {
        bankCode: code,
        accountNumber: accountNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  static async deleteAccount(token: string, id: number) {
    return await Axios.delete(`/accounts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  static async makeDefault(token: string, id: number) {
    return Axios.put(
      `/accounts/default/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
}
