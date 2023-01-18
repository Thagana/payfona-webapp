const devConfig = {
  SERVER_URL: import.meta.env.VITE_API_URL,
  PAY_STACK_PUBLIC: import.meta.env.VITE_PAY_STACK_PUBLIC,
};

const prodConfigs = {
  SERVER_URL: import.meta.env.VITE_API_URL,
  PAY_STACK_PUBLIC: import.meta.env.VITE_PAY_STACK_PUBLIC,
};

const configs =
  import.meta.env.MODE === "development" ? devConfig : prodConfigs;

export default configs;
