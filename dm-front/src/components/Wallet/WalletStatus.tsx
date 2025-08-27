import { StatusBadge } from '@/components/StatusBadge';
import { TextProps } from '@/components/Text';

export enum EWalletStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

interface WalletStatusProps {
  status: EWalletStatus;
}

const commonBoxProps = {
  boxProps: {
    paddingX: 4,
    paddingY: 2,
  },
  cssProps: {
    maxWidth: 'fit-content',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 15,
  },
};

const commonTextProps = {
  fontSize: 'smallestText',
  fontWeight: 'smallText',
  color: 'static.white',
} as TextProps;

const walletStatusStyles = {
  [EWalletStatus.ACTIVE]: {
    boxProps: {
      ...commonBoxProps?.boxProps,
      cssProps: {
        ...commonBoxProps?.cssProps,
        backgroundColor: 'static.greens.300',
      },
    },
    textProps: {
      ...commonTextProps,
    },
  },
  [EWalletStatus.INACTIVE]: {
    boxProps: {
      ...commonBoxProps?.boxProps,
      cssProps: {
        ...commonBoxProps?.cssProps,
        backgroundColor: 'static.reds.300',
      },
    },
    textProps: { ...commonTextProps },
  },
};
export function WalletStatus(props: WalletStatusProps) {
  const { status } = props;
  const styles = walletStatusStyles[status];

  return (
    <StatusBadge
      boxProps={{ ...styles?.boxProps }}
      textProps={{ ...styles?.textProps }}
    >
      {status}
    </StatusBadge>
  );
}
