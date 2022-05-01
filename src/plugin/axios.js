import axios from "axios";
import { navigate } from "@reach/router";

export const CancelToken = axios.CancelToken;
const customInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

customInstance.defaults.validateStatus = (status) => {
  return status >= 200 && status < 300;
};

customInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    const { shouldRefresh, requireAuth } = error?.response?.data || {};
    if (shouldRefresh) {
      window.location.reload();
    } else if (requireAuth) {
      navigate("/install");
    }
    return Promise.reject(error.response.data);
  }
);

export default customInstance;
