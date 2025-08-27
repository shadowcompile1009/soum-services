import type { Grade as OriginalGrade } from '@/models/ProductListing';
import { StatusBadge } from '@/components/StatusBadge';
import { TextProps } from '@/components/Text';

type Grade = 'excellent' | 'great' | 'good' | 'extensive' | 'unknown';

interface ProductGradeProps {
  grade: Grade;
  originalGrade: OriginalGrade;
}

const commonBoxProps = {
  boxProps: {
    paddingX: 6,
    paddingY: 4,
  },
  cssProps: {
    maxWidth: 'fit-content',
    borderRadius: 4,
  },
};

const commonTextProps = {
  fontSize: 'smallestText',
  fontWeight: 'smallText',
  color: 'static.white',
} as TextProps;

const styles = {
  excellent: {
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
  good: {
    boxProps: {
      ...commonBoxProps?.boxProps,
      cssProps: {
        ...commonBoxProps?.cssProps,
        backgroundColor: 'static.orange',
      },
    },
    textProps: { ...commonTextProps },
  },
  great: {
    boxProps: {
      ...commonBoxProps?.boxProps,
      cssProps: {
        ...commonBoxProps?.cssProps,
        backgroundColor: 'static.greens.400',
      },
    },
    textProps: { ...commonTextProps },
  },
  extensive: {
    boxProps: {
      ...commonBoxProps?.boxProps,
      cssProps: {
        ...commonBoxProps?.cssProps,
        backgroundColor: 'static.reds.300',
      },
    },
    textProps: { ...commonTextProps },
  },
  unknown: {
    boxProps: {
      ...commonBoxProps?.boxProps,
      cssProps: {
        ...commonBoxProps?.cssProps,
        backgroundColor: 'static.brown',
      },
    },
    textProps: { ...commonTextProps },
  },
};
export function ProductGrade(props: ProductGradeProps) {
  const { grade, originalGrade } = props;
  const style = styles[grade];

  return (
    <StatusBadge
      boxProps={{ ...style?.boxProps }}
      textProps={{ ...style?.textProps }}
    >
      {originalGrade}
    </StatusBadge>
  );
}
