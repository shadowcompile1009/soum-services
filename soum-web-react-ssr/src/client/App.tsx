import React, { JSX } from "react";
import { Route, Routes } from "react-router";
import { AppProps } from "@declarations/app/app.type";
import { HomePage } from "./pages/HomePage/HomePage";
import { ClientSideProps } from "./context/ClientSideProps";
import { RootLayout } from "./layouts/RootLayout/RootLayout";
import { Error404Page } from "./pages/Error404Page/Error404Page";
import { useLocale } from "@hooks/useLocale";
import pako from "pako";

export const App = (props: AppProps): JSX.Element => {
  const { isRTL, language } = useLocale();

  return (
    <ClientSideProps
      value={{
        clientSideProps: props.clientSideProps,
      }}
    >
      <html dir={isRTL ? "rtl" : "ltr"} lang={language}>
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap"
            rel="stylesheet"
            media="none"
          />
          <link href="/index.css" rel="stylesheet" />
        </head>
        <body>
          <Routes>
            <Route path="/en">
              <Route element={<RootLayout />}>
                <Route index Component={HomePage} />
                <Route path="*" Component={Error404Page} />
              </Route>
              <Route path="*" Component={Error404Page} />
            </Route>
            <Route path="/*">
              <Route element={<RootLayout />}>
                <Route index Component={HomePage} />
                <Route path="*" Component={Error404Page} />
              </Route>
              <Route path="*" Component={Error404Page} />
            </Route>
          </Routes>
          <script>{`window._APP_PROPS_=[${pako.deflate(
            JSON.stringify(props)
          )}]`}</script>
          <script src="/index.js" async type="module" />
        </body>
      </html>
    </ClientSideProps>
  );
};

export default App;
