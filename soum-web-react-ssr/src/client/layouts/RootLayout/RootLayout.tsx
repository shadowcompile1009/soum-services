import { Outlet } from "react-router-dom";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import React, { JSX } from "react";

export const RootLayout = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full gap-5">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
