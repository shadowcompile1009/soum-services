import { Stack } from '@/components/Layouts';
import styled, { css } from 'styled-components';
import { DetailEditLink, DetailDeleteLink } from './DetailLink';
import { IAddon } from '@/models/Addon';

const ActionContainer = styled(Stack)(() => css({}));
const Actions = ({
  addon,
  refetch,
}: {
  addon: IAddon;
  refetch: () => void;
}) => {
  return (
    <Stack direction="vertical" gap="8" justify="center" align="center">
      <ActionContainer gap="5" direction="horizontal" align="center">
        <DetailEditLink addon={addon} refetch={refetch} />
        <DetailDeleteLink addonId={addon?.id} refetch={refetch} />
      </ActionContainer>
    </Stack>
  );
};

export default Actions;
