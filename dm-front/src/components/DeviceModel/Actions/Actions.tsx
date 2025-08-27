import { Stack } from '@/components/Layouts';
import { DeviceModel } from '@/models/DeviceModel';
import styled, { css } from 'styled-components';
import DetailLink from './DetailLink';
import AddonLink from './AddonLink';
import EditAction from './EditAction';
import DeleteAction from './DeleteAction';

export interface ActionProps {
  deviceModel: DeviceModel;
  queryKey: string;
}

const ActionContainer = styled(Stack)(() => css({}));
const Actions = (props: ActionProps) => {
  const { deviceModel, queryKey } = props;

  return (
    <Stack direction="vertical" gap="8" justify="center" align="center">
      <ActionContainer gap="5" direction="horizontal" align="center">
        <AddonLink deviceModel={deviceModel} queryKey={queryKey} />
        <DetailLink deviceModel={deviceModel} queryKey={queryKey} />
        <EditAction deviceModel={deviceModel} queryKey={queryKey} />
        <DeleteAction deviceModel={deviceModel} queryKey={queryKey} />
      </ActionContainer>
    </Stack>
  );
};

export default Actions;
