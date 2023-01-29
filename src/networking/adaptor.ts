import axios, { AxiosRequestConfig } from "axios";
import configs from "../configs/config";

let baseURL = "";

const instance = axios.create({
  validateStatus: (status) => {
    let correct = false;

    if (status >= 200 && status < 300) {
      correct = true;
    } else if (
      status === 401 ||
      status === 400 ||
      status === 403 ||
      status === 503 ||
      status === 422
    ) {
      correct = true;
    }

    return correct;
  },
});

instance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    if (!config.headers) {
      return config;
    }
    const token = localStorage.getItem("authToken") || "";

    if (config.url && config.url.charAt(0) === "/") {
      config.url = `${baseURL}${config.url}`;
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    if (!config.headers) {
      return config;
    }
    baseURL = `${configs.SERVER_URL}`;
    const token = localStorage.getItem("authToken") || "";
    if (config.url && config.url.charAt(0) === "/") {
      config.url = `${baseURL}${config.url}`;
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
