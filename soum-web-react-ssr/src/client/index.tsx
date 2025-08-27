import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { AppProps } from "@declarations/app/app.type";
import i18n from "./i18n";
import "./index.css";
import pako from "pako";

const { _APP_PROPS_ } = window as unknown as {
  _APP_PROPS_: pako.Data;
};

const props = JSON.parse(
  pako.inflate(_APP_PROPS_, { to: "string" })
) as AppProps;

i18n.changeLanguage(props.clientSideProps.language);

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <App {...props} />
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);
