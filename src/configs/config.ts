const devConfigs = {
  SERVER_URL: import.meta.env.VITE_API_URL,
  PAY_STACK_PUBLIC: import.meta.env.VITE_PAY_STACK_PUBLIC,
}

const prodConfigs = {
  SERVER_URL: import.meta.env.VITE_API_URL,
  PAY_STACK_PUBLIC: import.meta.env.VITE_PAY_STACK_PUBLIC,
}

const config = import.meta.env.MODE === 'development' ? devConfigs : prodConfigs

export default config;