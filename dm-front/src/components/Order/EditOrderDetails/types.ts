export interface ButtonProps {
  width?: React.CSSProperties['width'];
}

export interface OrderFormValues {
  orderStatus: {
    id: string;
    displayName: string;
    name: string;
  };
  nctReason: {
    id: string;
    displayName: string;
  };
  nctPenalty: any;
}

export interface OrderDetailsProps {
  orderDetails: any;
  isLoading?: boolean;
}
