type DeliveryRule = {
  to: string;
  to_ar: string;
  min_expected_delivery_time: number;
  max_expected_delivery_time: number;
};

type DeliverySetting = {
  from: string;
  from_ar: string;
  delivery_rule: DeliveryRule[];
};

export const getDeliveryTime = (
  sellerCity: string,
  buyerCity: string,
  deliverySettings: DeliverySetting[]
) => {
  for (const { from, from_ar, delivery_rule } of deliverySettings) {
    if ([from, from_ar].includes(sellerCity)) {
      const match = delivery_rule.find(({ to, to_ar }) =>
        [to, to_ar].includes(buyerCity)
      );
      if (match) {
        return `Within ${match.min_expected_delivery_time} to ${match.max_expected_delivery_time} days work`;
      }
    }
  }
  return 'Within 6 to 7 days work';
};
