import { ApiPath, LyyApi } from "../constant";
import { fetch } from "../utils";
import { getHeaders } from "./api";

export const fetchLyyBackend = async (
  url: string,
  data: any = {},
  options?: Record<string, unknown>,
) => {
  try {
    const headers = getHeaders();
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(data),
      headers,
      ...options,
    };
    const res = await fetch(url, fetchOptions);
    const json = await res.json();
    if (json.code !== 0) {
      return null;
    }
    return json.content;
  } catch (error) {
    console.error(error);
  }
  return null;
};

const createFetchPath = (apiPath: string) => {
  let baseURL = ApiPath.Lyy as string;
  if (baseURL.endsWith("/")) {
    baseURL = baseURL.slice(0, -1);
  }
  let api = apiPath;
  if (api.startsWith("/")) {
    api = api.slice(1);
  }
  return [baseURL, api].join("/");
};

export const fetchUsageRecords = async (data: any = {}) => {
  return fetchLyyBackend(createFetchPath(LyyApi.usageRecords), data);
};

export const fetchRechargeRecords = async (data: any = {}) => {
  return fetchLyyBackend(createFetchPath(LyyApi.payRecords), data);
};
