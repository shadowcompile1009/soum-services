export interface ButtonProps {
  width?: React.CSSProperties['width'];
}

export interface DisputeFormValues {
  disputeStatus: {
    id: string;
    displayName: string;
    name: string;
  };
}

export interface DisputeDetailsProps {
  orderDetails: any;
  isLoading?: boolean;
}
