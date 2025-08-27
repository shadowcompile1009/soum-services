import { SideNav } from './SideNav';
import { WalletIcon } from './WalletIcon';

export function PayoutNav2_0() {
  return (
    <SideNav>
      {({ isContainerOpen, handleToggle, open }) => (
        <>
          <SideNav.MenuButton
            open={open}
            isContainerOpen={isContainerOpen}
            handleToggle={handleToggle}
            navIcon={<WalletIcon />}
            navText="Payout Mangement 2.0"
          />
          <SideNav.NavLinks
            isContainerOpen={isContainerOpen}
            open={open}
            routePaths={[
              {
                url: '/payouts2_0/buyer-refund',
                fullTitle: 'Buyer Refund',
                shortTitle: 'BR2',
              },
              {
                url: '/payouts2_0/seller-payout',
                fullTitle: 'Seller Payout',
                shortTitle: 'SP2',
              },
            ]}
          />
        </>
      )}
    </SideNav>
  );
}
