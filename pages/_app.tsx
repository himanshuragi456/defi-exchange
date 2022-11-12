/* eslint-disable react/no-danger */
/**
 *   Library imports
 */
import Head from "next/head";
import { ThemeProvider } from "next-themes";
// import { ApiClient, ApiProvider } from "jsonapi-react";

/**
 *   Required styles import
 */

import "../styles/globals.css";
import React from "react";
// import { jsonApiUrl, sanctumUrl } from "../api/config";
// import { getCookie } from "../helpers/getCookie";
// import { schema } from "../helpers/schema";

interface CustomPageProps {
  // <--- your custom page props
  // your props
  Component: any;
  pageProps: any;
}

// const client = new ApiClient({
//   url: jsonApiUrl(),
//   // @ts-expect-error
//   fetch: async function (url, options) {
//     // @ts-expect-error
//     // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
//     if (!options?.method) {
//       return await fetch(url, {
//         ...options,
//         credentials: "same-origin",
//         headers: {
//           // @ts-expect-error
//           ...options?.headers,
//           "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
//         },
//       });
//     }
//     // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
//     return await fetch(sanctumUrl() + "/csrf-cookie", {
//       method: "GET",
//       credentials: "same-origin",
//       headers: {
//         // @ts-expect-error
//         ...options?.headers,
//         "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
//       },
//     })
//       .then(async (response) => {
//         return await fetch(url, {
//           ...options,
//           credentials: "same-origin",
//           headers: {
//             // @ts-expect-error
//             ...options.headers,
//             "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
//           },
//         });
//       })
//       .catch((error) => {
//         console.log("Error while fetching CSRF token!", error);
//       });
//   },
//   schema,
// });

const MyApp: React.FC<CustomPageProps> = ({ Component, pageProps }) => {
  /**
   *   PAGE TRANSISTION
   *   @description - While Page transition displaying loading bar
   */

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#fff" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      {/* <ApiProvider client={client}> */}
      <ThemeProvider enableSystem={true} attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
      {/* </ApiProvider> */}
    </>
  );
};

export default MyApp;
