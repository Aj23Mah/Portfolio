import axios, { AxiosInstance } from "axios";
// import { getToken } from "../utils/helpers/tokenStorage.helper";
// import { isAuthenticated } from "../utils/helpers/checkIfAuthenticated";
// import { errorNotification } from "../utils/helpers/notifications";
import { BASE_URL } from "@/config/baseURL";

const baseAxios: AxiosInstance = axios.create();

baseAxios.defaults.baseURL = BASE_URL;
// Add a request interceptor
baseAxios.interceptors.request.use(
  function (config) {
    config.headers.organization = "ajay";
    // process.env.CODE ?? 'travel-nepal';
    return config;
  }, // function(config)
  function (error) {
    return Promise.reject(error);
  } // function(error)
); // baseAxios.interceptors.request.use

baseAxios.interceptors.response.use(
  function (response) {
    if (response.status === 200) {
      // console.log('data loaded successfully');
    }

    if (response.status === 201) {
      // console.log('data created    successfully');
    }
    return response.data;
  }, // function(response)
  function (error) {
    const errorVal = error?.response?.data?.error;
    console.log(error);
    console.log({
      title: errorVal?.name ?? "Error",
      message: errorVal?.message ?? "Action could not be completed",
    });

    if ([401].includes(error?.response?.status)) {
    }
    return Promise.reject(errorVal);
  } // function(error)
); // baseAxios.interceptors.response.use

export default baseAxios;
