import { RequestOptions } from "./requestBuilder";

export interface Config {
  apiUrl: string;
  jsonApiUrl: string;
  sanctumUrl: string;
  authUrl: string;
}

export const defaultConfig: Config = {
  apiUrl: "/api/v2/launchpad",
  jsonApiUrl: "/api/v2/launchpad",
  sanctumUrl: "/api/v2/launchpad/sanctum",
  authUrl: "/api/v2/launchpad/api",
};

declare global {
  interface Window {
    env: Config;
  }
}

export const IcoApp = {
  config: { ...defaultConfig },
};
// global.window.env = global.window?.env ?? defaultConfig;
// IcoApp.config = { ...defaultConfig, ...global.window.env };

export const apiUrl: Function = () => IcoApp.config.apiUrl;
export const jsonApiUrl: Function = () => IcoApp.config.jsonApiUrl;
export const sanctumUrl: Function = () => IcoApp.config.sanctumUrl;
export const authUrl: Function = () => IcoApp.config.authUrl;

export const BaseApiConfig: RequestOptions = {
  apiVersion: "apiUrl",
};
