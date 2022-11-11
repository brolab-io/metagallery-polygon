import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_MORALIS_API_URL;

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.request.use((config) => {
  if (config.url?.startsWith("http") && !config.baseURL) {
    config.baseURL = axios.defaults.baseURL;
  }
  return config;
});
