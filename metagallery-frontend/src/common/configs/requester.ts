import axios from "axios";

const requester = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

requester.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default requester;
