import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from "axios";
import { apiUrl, authUrl, jsonApiUrl, sanctumUrl } from "./config";

export type HTTPMethod = "get" | "post" | "delete" | "put" | "patch";

export interface JsonBody {
  // tslint:disable-next-line no-any
  [key: string]: any;
}

export interface RequestOptions {
  apiVersion: "apiUrl" | "authUrl" | "sanctumUrl" | "jsonApiUrl";
}

export interface Request {
  method: HTTPMethod;
  url: string;
  body?: JsonBody;
  headers?: JsonBody;
}

export interface ApiVariety {
  apiUrl: string;
}

const getAPI: Function = () => ({
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  apiUrl: `${apiUrl()}`,
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  jsonApiUrl: `${jsonApiUrl()}`,
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  sanctumUrl: `${sanctumUrl()}`,
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  authUrl: `${authUrl()}`,
});

const buildRequest: Function = (
  request: Request,
  configData: RequestOptions
) => {
  const { body, method, url, headers } = request;
  const { apiVersion } = configData;
  const api = getAPI();

  const contentType =
    body instanceof FormData ? "multipart/form-data" : "application/json";

  const localHeaders = {
    ...headers,
    "content-type": contentType,
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  const apiUrl = api[apiVersion];

  const requestConfig: AxiosRequestConfig = {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    baseURL: apiUrl,
    data: body,
    headers: localHeaders,
    maxRedirects: 0,
    method,
    url,
    xsrfCookieName: "XSRF-TOKEN",
    withCredentials: true,
  };

  return requestConfig;
};

export const defaultResponse: Partial<AxiosError["response"]> = {
  status: 500,
  data: {
    error: "Server error",
  },
};

export const formatError: Function = (responseError: AxiosError) => {
  const response: any = responseError.response ?? defaultResponse;
  const errors =
    Boolean(response.data) && (response.data.errors ?? [response.data.error]);
  return {
    code: response.status,
    message: errors,
  };
};

export const makeRequest: Function = async (
  request: Request,
  configData: RequestOptions
) => {
  const requestConfig = buildRequest(request, configData);

  return await new Promise((resolve, reject) => {
    // Request CSRF token for all get requests
    if (request.method.toLowerCase() !== "get") {
      axios
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        .get(sanctumUrl() + "/csrf-cookie")
        .then(() => {
          const axiosRequest: AxiosPromise = axios(requestConfig);
          axiosRequest
            .then((response: unknown) => {
              resolve(response);
            })
            .catch((error: AxiosError) => {
              reject(formatError(error));
            });
        })
        .catch((error: AxiosError) => {
          reject(formatError(error));
        });
    } else {
      const axiosRequest: AxiosPromise = axios(requestConfig);
      axiosRequest
        .then((res: unknown) => {
          resolve(res);
        })
        .catch((error: AxiosError) => {
          reject(formatError(error));
        });
    }
  });
};
