import axios from "axios";

const apiRequester = axios.create({});

apiRequester.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiRequester;
