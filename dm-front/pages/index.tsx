import Head from 'next/head';
import { NextPageContext } from 'next';

import { User } from '@/models/User';
import { SplitScreen, StickyHeaderFooter } from '@/components/Layouts';
import {
  Logo,
  FooterContainer,
  MainContainer,
  SoumLogo,
  LoginForm,
} from '@/components/Login';

function IndexPage() {
  return (
    <>
      <Head>
        <title>Delta Machine</title>
      </Head>
      <SplitScreen>
        <SplitScreen.RightHalf>
          <StickyHeaderFooter>
            <StickyHeaderFooter.Main>
              <MainContainer>
                <SoumLogo />
                <LoginForm />
              </MainContainer>
            </StickyHeaderFooter.Main>
            <StickyHeaderFooter.Fixed>
              <FooterContainer>
                <Logo />
              </FooterContainer>
            </StickyHeaderFooter.Fixed>
          </StickyHeaderFooter>
        </SplitScreen.RightHalf>
        <SplitScreen.LeftHalf />
      </SplitScreen>
    </>
  );
}
export async function getServerSideProps(ctx: NextPageContext) {
  return User.checkIfLoggedIn(ctx);
}

export default IndexPage;
