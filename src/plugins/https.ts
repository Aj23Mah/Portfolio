
import { apiFetch, ApiRequestConfig } from "./fetchWrapper";

export const GetRequest = async (url = "", config: ApiRequestConfig = {}) => {
  const response = await apiFetch(url, { ...config, method: "GET" });
  return response.data;
};

export const PostRequest = async (
  url = "",
  body: any,
  config: ApiRequestConfig = {}
) => {
  const response = await apiFetch(url, { ...config, method: "POST", body });
  return response.data;
};

export const PutRequest = async (
  url = "",
  body: any,
  config: ApiRequestConfig = {}
) => {
  const response = await apiFetch(url, { ...config, method: "PUT", body });
  return response.data;
};

export const DeleteRequest = async (url = "", config: ApiRequestConfig = {}) => {
  const response = await apiFetch(url, { ...config, method: "DELETE" });
  return response.data;
};
