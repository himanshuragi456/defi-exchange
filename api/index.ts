import { AxiosResponse } from "axios";
import { JsonBody, makeRequest, RequestOptions } from "./requestBuilder";

export type { RequestOptions } from "./requestBuilder";
export type RequestBody = JsonBody | FormData;

export type RequestMethod = (
  config: RequestOptions
) => (
  url: string,
  body?: RequestBody,
  headers?: JsonBody
) => Promise<AxiosResponse["data"]>;

export interface ApiWrapper {
  get: RequestMethod;
  post: RequestMethod;
  patch: RequestMethod;
  put: RequestMethod;
  delete: RequestMethod;
}

export const API: ApiWrapper = {
  get:
    (config: RequestOptions) =>
    async (url: string, body?: JsonBody, headers?: JsonBody) =>
      makeRequest(
        {
          method: "get",
          url,
          headers,
        },
        config
      ),

  post:
    (config: RequestOptions) =>
    async (url: string, body?: JsonBody, headers?: JsonBody) =>
      makeRequest(
        {
          method: "post",
          body,
          url,
          headers,
        },
        config
      ),

  patch:
    (config: RequestOptions) =>
    async (url: string, body?: JsonBody, headers?: JsonBody) =>
      makeRequest(
        {
          method: "patch",
          body,
          url,
          headers,
        },
        config
      ),

  put:
    (config: RequestOptions) =>
    async (url: string, body?: JsonBody, headers?: JsonBody) =>
      makeRequest(
        {
          method: "put",
          body,
          url,
          headers,
        },
        config
      ),

  delete:
    (config: RequestOptions) =>
    async (url: string, body?: JsonBody, headers?: JsonBody) =>
      makeRequest(
        {
          method: "delete",
          url,
          headers,
        },
        config
      ),
};
