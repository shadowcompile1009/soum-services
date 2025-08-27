import { Stack } from '@/components/Layouts';

import CategoriesNav from './CategoriesNav';
import { FrontlinerNav } from './FrontlinerNav';
import { LogisticsNav } from './LogisticsNav';
import { MessageNav } from './MessageNav';
import { OperationNav } from './OperationNav';
import { OrderV2Nav } from './OrderV2Nav';
import { PayoutNav } from './PayoutNav';
import { PromocodeNav } from './PromocodeNav';
import { SettingsNav } from './SettingsNav';
import { UpfrontPaymentNav } from './UpfrontPaymentNav';
import { WalletNav } from './WalletNav';

export function SidebarNav() {
  return (
    <Stack direction="vertical" gap="2">
      <OperationNav />
      <OrderV2Nav />
      <UpfrontPaymentNav />
      {/* TODO: Add Dispute Nav Back in */}
      {/* <DisputeNav /> */}
      <CategoriesNav />
      <PayoutNav />
      {/* TODO: Add Payout Nav 2.0 Back in */}
      {/* <PayoutNav2_0 /> */}
      <MessageNav />
      <WalletNav />
      <LogisticsNav />
      <FrontlinerNav />
      <PromocodeNav />
      <SettingsNav />
    </Stack>
  );
}
