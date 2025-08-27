import React from 'react';
import { ThemeProvider } from 'styled-components';

import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
} from '@tanstack/react-query';
import { ModalProvider } from 'styled-react-modal';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NextNProgress from 'nextjs-progressbar';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GlobalResetStyles } from '@/styles/GlobalResetStyles';
import { tokens as theme } from '@/tokens/index';
import { Toaster } from '@/components/Toast';
import { ModalBackground } from '@/components/Modal';
import { colors } from '@/tokens/colors';
import { AppPropsWithLayout } from '@/types/next';

import '@src/styles/global.css';
import '@src/components/Login/TwoFaForm.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function identity(page: React.ReactNode) {
  return page;
}

function App({ Component, pageProps }: AppPropsWithLayout): React.ReactElement {
  const getLayout = Component.getLayout || identity;
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <ModalProvider backgroundComponent={ModalBackground}>
          <GlobalResetStyles />
          <NextNProgress
            color={colors.static.blue}
            showOnShallow={false}
            height={1}
            nonce="nonce"
          />
          {getLayout(
            // @ts-ignore
            <Hydrate state={pageProps.dehydratedState}>
              <ErrorBoundary>
                <Component {...pageProps} />
              </ErrorBoundary>
            </Hydrate>
          )}
          <Toaster />
        </ModalProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
