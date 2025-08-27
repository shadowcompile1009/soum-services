import { AppProps } from "@declarations/app/app.type";
import React, { JSX, ReactNode, createContext, useContext } from "react";

export const ServerSideProps = createContext<{
  serverSideProps?: AppProps["serverSideProps"];
}>({});

export const useServerSideProps = (): {
  serverSideProps?: AppProps["serverSideProps"];
} => useContext(ServerSideProps);

export type ServerSidePropsProviderProps = {
  children: ReactNode;
  serverSideProps?: AppProps["serverSideProps"];
};

export const ServerSidePropsProvider = ({
  children,
  serverSideProps,
}: ServerSidePropsProviderProps): JSX.Element => {
  return (
    <ServerSideProps.Provider value={{ serverSideProps }}>
      {children}
    </ServerSideProps.Provider>
  );
};
