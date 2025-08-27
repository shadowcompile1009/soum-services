import Fastify from "fastify";
import path from "node:path";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "../client/App";
import { I18nextProvider } from "react-i18next";
import React from "react";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "@fastify/cookie";
import i18n from "../client/i18n";
import { fetchCategories } from "../libs/http/services/api-v2/category/category";
import { toEitherJSON } from "@utils/either";
import { fetchHomePageData } from "../libs/http/services/homepage/homepage";
import { fetchSettings } from "../libs/http/services/api-v2/settings/settings";
import { fetchBrands } from "../libs/http/services/api-v2/brand/brand";
import { AppProps } from "@declarations/app/app.type";
import { fetchRecentlySoldProductsData } from "../libs/http/services/order/order";

const fastify = Fastify();

fastify.register(fastifyCookie, {
  hook: "preHandler",
});

const isProduction = process.env.NODE_ENV === "production";

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "./public"),
  prefix: "/",
  wildcard: false,
  cacheControl: false,
  logLevel: "silent",
  setHeaders(res) {
    res.setHeader(
      "cache-control",
      isProduction ? "public, max-age=31536000" : "private, no-store"
    );
  },
});

fastify.get("/ar*", async (req, res) => {
  return res.redirect(req.url.replace("/ar", "/"));
});

fastify.get("/*", async (req, res) => {
  const language = req.url.startsWith("/en") ? "en" : "ar";

  const i18nInstance = i18n.cloneInstance();

  i18n.changeLanguage(language);

  const pathname = req.url.replace("/ar", "/").replace("/en", "/");

  const isHomePage = pathname === "/";

  const defaultData = async (): Promise<
    Omit<AppProps["clientSideProps"], "language">
  > => {
    const result = await Promise.all([
      fetchSettings(),
      fetchCategories(),
      fetchBrands(),
    ]);

    return {
      settings: toEitherJSON(result[0]),
      categories: toEitherJSON(result[1]),
      brands: toEitherJSON(result[2]),
    };
  };

  const homePageData = async (): Promise<
    Omit<AppProps["clientSideProps"], "language">
  > => {
    const { settings, categories, brands } = await defaultData();

    const result = await Promise.all([
      fetchHomePageData(),
      fetchRecentlySoldProductsData(),
    ]);

    return {
      settings,
      categories,
      brands,
      homepageData: toEitherJSON(result[0]),
      recentlySoldProductsData: toEitherJSON(result[1]),
    };
  };

  const html = ReactDOMServer.renderToString(
    <I18nextProvider i18n={i18nInstance}>
      <StaticRouter location={req.url}>
        <App
          clientSideProps={{
            language,
            ...(isHomePage ? await homePageData() : await defaultData()),
          }}
        />
      </StaticRouter>
    </I18nextProvider>
  );

  return res
    .type("text/html")
    .header(
      "cache-control",
      isProduction ? "public, max-age=600, s-maxage=3600" : "private, no-store"
    )
    .send(html);
});

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error("failed to start server", err);

    throw err;
  }

  console.log(`Server is now listening on ${address}`);
});

process.on("uncaughtException", console.error);

process.on("unhandledRejection", console.error);
