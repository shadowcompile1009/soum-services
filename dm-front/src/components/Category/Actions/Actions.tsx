import { Stack } from '@/components/Layouts';
import { CategoriesValues, Category } from '@/models/Category';
import styled, { css } from 'styled-components';
import DetailLink from './DetailLink';

export interface ActionProps {
  category: Category;
  categoryType: CategoriesValues;
  queryKey: string;
}

const ActionContainer = styled(Stack)(() => css({}));
const Actions = (props: ActionProps) => {
  const { category, queryKey, categoryType } = props;

  return (
    <Stack direction="vertical" gap="8" justify="center" align="center">
      <ActionContainer gap="5" direction="horizontal" align="center">
        <DetailLink
          category={category}
          queryKey={queryKey}
          categoryType={categoryType}
        />
      </ActionContainer>
    </Stack>
  );
};

export default Actions;
