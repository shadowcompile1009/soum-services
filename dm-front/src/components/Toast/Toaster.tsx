import { ToastBar, Toaster as RHToaster } from 'react-hot-toast';
import styled from 'styled-components';
import css from '@styled-system/css';

type ToastVariants = 'error' | 'success';
interface ToastProps {
  variant: ToastVariants;
}

const variantStyles: Record<ToastVariants, Record<string, string>> = {
  error: {
    color: 'static.reds.400',
    backgroundColor: 'static.reds.100',
    borderBottomColor: 'static.reds.300',
  },
  success: {
    color: 'static.greens.400',
    backgroundColor: 'static.greens.100',
    borderBottomColor: 'static.greens.300',
  },
};

const Toast = styled('div')((props: ToastProps) => {
  const { variant } = props;
  const styles = variantStyles[variant];

  return css({
    minHeight: 30,
    minWidth: 280,
    display: 'flex',
    alignItems: 'center',
    borderBottom: '4px solid',
    fontSize: 'baseText',
    fontWeight: 'regular',
    paddingLeft: 8,
    ...styles,
  });
});

export function Toaster() {
  return (
    <RHToaster>
      {(toast) => {
        if (toast.type === 'error') {
          return (
            <Toast variant="error">
              <span>{toast.message as string}</span>
            </Toast>
          );
        }
        if (toast.type === 'success') {
          return (
            <Toast variant="success">
              <span>{toast.message as string}</span>
            </Toast>
          );
        }
        return <ToastBar toast={toast} />;
      }}
    </RHToaster>
  );
}
