import { colors } from '@/tokens/colors';

export const styles = {
  container: (provided: Record<string, unknown>) => ({
    ...provided,
    minWidth: '200px',
    textAlign: 'left',
  }),
  control: (provided: Record<string, unknown>) => ({
    ...provided,
    '&:hover': {
      borderColor: colors.static.blue,
    },
  }),
};
