import { Stack } from '@/components/Layouts';
import { Brand } from '@/models/Brand';
import { CategoriesValues } from '@/models/Category';
import styled, { css } from 'styled-components';
import DetailLink from './DetailLink';

export interface ActionProps {
  brand: Brand;
  categoryType: CategoriesValues;
  queryKey: string;
  categoryId: string;
}

const ActionContainer = styled(Stack)(() => css({}));
const Actions = (props: ActionProps) => {
  const { brand, queryKey, categoryType, categoryId } = props;

  return (
    <Stack direction="vertical" gap="8" justify="center" align="center">
      <ActionContainer gap="5" direction="horizontal" align="center">
        <DetailLink
          brand={brand}
          queryKey={queryKey}
          categoryType={categoryType}
          categoryId={categoryId}
        />
      </ActionContainer>
    </Stack>
  );
};

export default Actions;
