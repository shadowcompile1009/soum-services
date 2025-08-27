import styled from 'styled-components';
import css from '@styled-system/css';

export const CaretIconContainer = styled('span')((props: { open: boolean }) => {
  const { open } = props;
  return css({
    transform: open ? 'rotate(-90deg)' : 'rotate(90deg)',
    transition: 'transform 200ms ease',
    marginLeft: 'auto',
  });
});
