import styled from 'styled-components';
import css from '@styled-system/css';
import StyledModal from 'styled-react-modal';

import { ButtonVariants } from '../Button/Button';
import { Button } from '@/components/Button';
import { Stack } from '@/components/Layouts';

interface DialogContainerProps {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  width?: number;
}

export const DialogContainer = styled('div')<DialogContainerProps>((props) => {
  const { top, bottom, left, right, width = 180 } = props;
  return css({
    maxHeight: 280,
    backgroundColor: 'static.white',
    padding: 10,
    borderRadius: 4,
    overflow: 'visible',
    position: 'absolute',
    top,
    bottom,
    left,
    right,
    width,
  });
});

export interface ConfirmationDialogProps
  extends Pick<
    DialogContainerProps,
    'top' | 'bottom' | 'left' | 'right' | 'width'
  > {
  onConfirm: (value: unknown) => void;
  onCancel: (error: any) => void;
  isOpen: boolean;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: ButtonVariants;
  cancelButtonVariant?: ButtonVariants;
}
export function ConfirmationDialog(
  props: ConfirmationDialogProps
): React.ReactElement {
  const {
    children,
    onCancel,
    onConfirm,
    confirmText = 'Yes',
    cancelText = 'Cancel',
    confirmButtonVariant = 'filled',
    cancelButtonVariant = 'darkFilled',
    isOpen,
    top,
    bottom,
    left,
    right,
    width,
  } = props;
  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={onCancel}
      onEscapeKeydown={onCancel}
    >
      <DialogContainer
        top={top}
        bottom={bottom}
        left={left}
        right={right}
        width={width}
      >
        <Stack direction="vertical" gap="12">
          {children}
          <Stack direction="horizontal" gap="10">
            <Button variant={confirmButtonVariant} onClick={onConfirm}>
              {confirmText}
            </Button>
            <Button variant={cancelButtonVariant} onClick={onCancel}>
              {cancelText}
            </Button>
          </Stack>
        </Stack>
      </DialogContainer>
    </StyledModal>
  );
}
