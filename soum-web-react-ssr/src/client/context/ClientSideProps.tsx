import { AppProps } from "@declarations/app/app.type";
import React, {
  JSX,
  ReactNode,
  createContext,
  useContext,
  useMemo,
} from "react";

export const ClientSideProps = createContext<{
  clientSideProps?: AppProps["clientSideProps"];
}>({});

export const useClientSideProps = (): {
  clientSideProps?: AppProps["clientSideProps"];
} => useContext(ClientSideProps);

export type ClientSidePropsProviderProps = {
  children: ReactNode;
  clientSideProps?: AppProps["clientSideProps"];
};

export const ClientSidePropsProvider = ({
  children,
  ...rest
}: ClientSidePropsProviderProps): JSX.Element => {
  const clientSideProps = useMemo(() => rest.clientSideProps, []);

  return (
    <ClientSideProps.Provider value={{ clientSideProps }}>
      {children}
    </ClientSideProps.Provider>
  );
};
