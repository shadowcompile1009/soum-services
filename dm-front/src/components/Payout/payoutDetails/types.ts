export interface ButtonProps {
  width?: React.CSSProperties['width'];
}

export interface PayoutFormValues {
  payoutStatus: string | undefined;
  sellerCommision: string | undefined;
}

export interface PayoutFormValues {
  orderStatus: {
    id: string;
    displayName: string;
    name: string;
  };
  financeReasoning: {
    label: string;
    value: string;
  };
}
