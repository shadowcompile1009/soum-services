import { StatusBadge } from '@/components/StatusBadge';
import { TextProps } from '@/components/Text';
import { ERequestStatus } from '@/models/Wallet';

interface TransactionStatusProps {
  status: ERequestStatus;
}

const commonBoxProps = {
  boxProps: {
    paddingX: 4,
    paddingY: 2,
  },
  cssProps: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: 'fit-content',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

const commonTextProps = {
  fontSize: 'smallestText',
  fontWeight: 'smallText',
  color: 'static.blues.500',
} as TextProps;

const transactionStatusStyles = {
  [ERequestStatus.PENDING]: {
    boxProps: {
      ...commonBoxProps.boxProps,
      cssProps: {
        ...commonBoxProps.cssProps,
        '&:before': {
          content: "''",
          display: 'block',
          height: '11px',
          width: '11px',
          borderRadius: '50%',
          marginRight: 5,
          backgroundColor: 'static.orange',
        },
      },
    },
    textProps: { ...commonTextProps },
  },
  [ERequestStatus.FAILED]: {
    boxProps: {
      ...commonBoxProps.boxProps,
      cssProps: {
        ...commonBoxProps.cssProps,
        '&:before': {
          content: "''",
          display: 'block',
          height: '11px',
          width: '11px',
          borderRadius: '50%',
          marginRight: 5,
          backgroundColor: 'static.reds.300',
        },
      },
    },
    textProps: { ...commonTextProps },
  },
  [ERequestStatus.SUCCESS]: {
    boxProps: {
      ...commonBoxProps.boxProps,
      cssProps: {
        ...commonBoxProps.cssProps,
        '&:before': {
          content: "''",
          display: 'block',
          height: '11px',
          width: '11px',
          borderRadius: '50%',
          marginRight: 5,
          backgroundColor: 'static.greens.300',
        },
      },
    },
    textProps: { ...commonTextProps },
  },
};

export function TransactionStatus(props: TransactionStatusProps) {
  const { status } = props;
  const styles = transactionStatusStyles[status];

  return (
    <StatusBadge
      boxProps={{ ...styles?.boxProps }}
      textProps={{ ...styles?.textProps }}
    >
      {status}
    </StatusBadge>
  );
}
