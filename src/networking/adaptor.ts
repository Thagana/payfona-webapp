import axios, { InternalAxiosRequestConfig } from "axios";
import configs from "../configs/config";

const baseURL = configs.SERVER_URL;

const instance = axios.create({
  validateStatus: (status) => {
    return (
      (status >= 200 && status < 300) ||
      [400, 401, 403, 422, 503].includes(status)
    );
  },
});

instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!config.headers) return config;

    const token = localStorage.getItem("authToken") || "";

    if (config.url && config.url.charAt(0) === "/") {
      config.url = `${baseURL}${config.url}`;
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default instance;
