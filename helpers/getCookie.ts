export const getCookie: Function = (name: string) => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!document.cookie) {
    return null;
  }
  const xsrfCookies = document.cookie
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c.startsWith(name + "="));

  if (xsrfCookies.length === 0) {
    return null;
  }
  return decodeURIComponent(xsrfCookies[0].split("=")[1]);
};
