import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';

import { User } from '@/models/User';
import {
  Sidebar,
  SidebarHeader,
  SidebarCheckbox,
  SidebarBody,
  SidebarNav,
  SidebarFooter,
} from '@/components/Sidebar';
import { ShellContainer } from '@/components/MainContent';
import { apiClientV2, apiGatewayClient, apiClientV1 } from '@/api/client';

export const WithShellLayout = (page: React.ReactNode): React.ReactElement => {
  if (typeof window !== 'undefined') {
    const token = User.getUserToken();
    apiClientV2.addAuthTokens(token);
    apiClientV1.addAuthTokens(token);
    apiGatewayClient.addAuthTokens(token);
  }
  const router = useRouter();
  async function handleLogout() {
    await User.logout();
    router.push('/');
  }
  return (
    <>
      <Head>
        <title>Delta Machine</title>
      </Head>
      <SidebarCheckbox />
      <Sidebar>
        <SidebarHeader />
        <SidebarBody>
          <SidebarNav />
        </SidebarBody>
        <SidebarFooter onClick={handleLogout} />
      </Sidebar>
      <ShellContainer>{page}</ShellContainer>
    </>
  );
};
