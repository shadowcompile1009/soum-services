import React, { FunctionComponent } from 'react';
import css from '@styled-system/css';
import styled from 'styled-components';

import { Box } from '@/components/Box';
import { Text } from '@/components/Text';

export interface ICheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  label?: string | React.ReactElement;
  id: string;
  labelStyle?: any;
}

export const CheckboxElement = styled.input(
  css({
    left: 0,
    opacity: 0,
    position: 'absolute',
    top: '50%',
    height: 7,
    width: 7,
    transform: 'translateY(-50%)',

    '&:checked + label::after': {
      opacity: 1,
    },

    '&:checked + label::before': {
      backgroundColor: 'static.white',
    },
  })
);

const Label = styled(Text).attrs({
  as: 'label',
})<{ htmlFor: string }>(
  css({
    display: 'block',
    paddingLeft: 11,
    '&::before': {
      content: "''",
      height: 7,
      left: 0,
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 7,
      borderRadius: 4,
      backgroundColor: 'static.white',
      border: '1px solid ',
      borderColor: 'static.blue',
      transition: 'all ease-in',
      transitionDuration: '200ms',
    },
    '&::after': {
      content: "''",
      borderLeft: 0,
      borderTop: 0,
      height: 6,
      left: '1px',
      opacity: 0,
      position: 'absolute',
      top: '56%',
      transform: 'translateY(-50%)',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M.387 5.606a1.18 1.18 0 0 1 0-1.748 1.39 1.39 0 0 1 1.871 0l1.684 1.573c.103.097.27.097.374 0L9.742.362a1.39 1.39 0 0 1 1.87 0 1.18 1.18 0 0 1 0 1.748L4.317 8.928a.278.278 0 0 1-.374 0L.387 5.606Z' fill='%233A57E8'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      width: 6,
      transition: 'all ease-in',
      transitionDuration: '200ms',
    },
  })
);

export const Checkbox: FunctionComponent<ICheckboxProps> = ({
  checked,
  id,
  label,
  labelStyle = {},
  ...props
}) => {
  return (
    <Box cssProps={{ position: 'relative' }}>
      <CheckboxElement
        checked={checked}
        id={id}
        name={id}
        type="checkbox"
        {...props}
      />
      <Label
        fontWeight="regular"
        fontSize="baseText"
        color="static.black"
        htmlFor={id}
        style={labelStyle}
      >
        {label}
      </Label>
    </Box>
  );
};
