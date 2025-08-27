import css from '@styled-system/css';
import styled from 'styled-components';

export const FormContainer = styled.form(() =>
  css({
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    rowGap: '1rem',
    width: '100%',
    marginTop: '1.5rem',
    overflowY: 'auto',
  })
);

export const ItemRow = styled.div(() =>
  css({
    display: 'flex',
    columnGap: '0.75rem',
  })
);

export const Item = styled.div(() =>
  css({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.5rem',
  })
);

export const ItemLabel = styled.label(() =>
  css({
    fontSize: '1rem',
    fontWeight: 'medium',
  })
);

export const FileUploadContainer = styled.div(() =>
  css({
    display: 'flex',
  })
);

export const FileUploadWrapperContainer = styled.div(() =>
  css({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.5rem',
  })
);
