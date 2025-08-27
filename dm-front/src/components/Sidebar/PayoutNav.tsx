import { SideNav } from './SideNav';
import { WalletIcon } from './WalletIcon';

export function PayoutNav() {
  return (
    <SideNav>
      {({ isContainerOpen, handleToggle, open }) => (
        <>
          <SideNav.MenuButton
            open={open}
            isContainerOpen={isContainerOpen}
            handleToggle={handleToggle}
            navIcon={<WalletIcon />}
            navText="Payout Mangement"
          />
          <SideNav.NavLinks
            isContainerOpen={isContainerOpen}
            open={open}
            routePaths={[
              {
                url: '/payouts/buyer-refund',
                fullTitle: 'Buyer Refund',
                shortTitle: 'BR',
              },
              {
                url: '/payouts/seller-payout',
                fullTitle: 'Seller Payout',
                shortTitle: 'SP',
              },
              {
                url: '/payouts/payment-logs',
                fullTitle: 'Payment Logs',
                shortTitle: 'Payment Logs',
              },
            ]}
          />
        </>
      )}
    </SideNav>
  );
}
