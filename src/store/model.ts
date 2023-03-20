import { action, Action } from "easy-peasy";

export type Account = {
  id: number;
  slug: string;
  code: string;
  pay_with_bank: boolean;
  active: boolean;
  type: string;
  country: string;
  currency: string;
  name: string;
  account_number: string;
  sub_account_code: string;
  user_id: number;
  is_default: boolean;
};

export type Profile = {
  fullName: string;
  lastName: string;
  firstName: string;
  email: string;
  avatar: string;
};
export interface Model {
  profile: {
    fullName: string;
    lastName: string;
    firstName: string;
    email: string;
    avatar: string;
  };
  accounts: Account[];
  token: string;
  isAuth: boolean;
  saveToken: Action<
    this,
    {
      token: string;
      profile: Profile;
      accounts: Account[];
    }
  >;
  logOut: Action<this>;
  updateProfile: Action<
    this,
    {
      type: "NAMES" | "PROFILE";
      firstName: string;
      lastName: string;
      fullName: string;
      avatar: string;
      email: string;
    }
  >;
  updateAvatar: Action<this, { avatar: string }>;
}

const model: Model = {
  profile: {
    firstName: "",
    lastName: "",
    fullName: "",
    avatar: "",
    email: "",
  },
  accounts: [],
  token: "",
  isAuth: false,
  saveToken: action((state, payload) => {
    const oldState = state;
    oldState.token = payload.token;
    oldState.profile = payload.profile;
    oldState.accounts = payload.accounts;
    oldState.isAuth = true;
  }),
  logOut: action((state) => {
    const oldState = state;
    oldState.isAuth = false;
    oldState.token = "";
  }),
  updateProfile: action((state, payload) => {
    const oldState = state;
    switch (payload.type) {
      case "NAMES":
        oldState.profile.firstName = payload.firstName;
        oldState.profile.lastName = payload.lastName;
        break;
      case "PROFILE":
        oldState.profile.avatar = payload.avatar;
        break;
      default:
        break;
    }
  }),
  updateAvatar: action((state, payload) => {
    const oldState = state;
    oldState.profile.avatar = payload.avatar;
  }),
};

export default model;
