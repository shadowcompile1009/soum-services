import styled from 'styled-components';
import css from '@styled-system/css';

import { Box } from '@/components/Box';

const SwitchBackground = styled.div(
  css({
    cursor: 'pointer',
    width: '38px',
    height: '20px',
    backgroundColor: 'static.grays.10',
    border: '1px solid',
    borderColor: 'static.grays.25',
    borderRadius: 20,
    position: 'relative',
    transition: 'background-color ease',
    transitionDuration: '200ms',
  })
);

const SwitchToggle = styled.span(
  css({
    width: 8,
    height: 8,
    backgroundColor: 'static.white',
    borderRadius: '50%',
    position: 'absolute',
    margin: '1px',
    left: 0,
    transition: 'left ease',
    transitionDuration: '200ms',
    boxSizing: 'border-box',
    border: '2px solid',
    borderColor: 'static.red',
    cursor: 'pointer',
  })
);

const SwitchInput = styled.input(
  css({
    width: 0,
    opacity: 0,
    position: 'absolute',
    height: 0,
    display: 'none',
  })
);

const SwitchContainer = styled(Box)(
  css({
    position: 'relative',
    cursor: 'pointer',
    'input:checked + [data-component=SwitchBackground]': {
      backgroundColor: 'static.blues.10',
    },
    'input:checked + [data-component=SwitchBackground] [data-component=SwitchToggle]':
      {
        left: '18px',
        borderColor: 'static.greens.300',
      },
    '*': {
      boxSizing: 'border-box',
    },
    '&[data-disabled] > [data-component=SwitchBackground]': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  })
);

interface ISwitchProps {
  id?: string;
  on?: boolean;
  defaultOn?: boolean;
  disabled?: boolean;
  onClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Switch: React.FC<ISwitchProps> = ({
  on,
  defaultOn,
  disabled,
  ...props
}) => (
  <SwitchContainer as="label" data-disabled={disabled ? true : null}>
    {/* @ts-ignore as onClick detect first change if true but onChange doesn't */}
    <SwitchInput
      type="checkbox"
      checked={on}
      defaultChecked={defaultOn}
      disabled={disabled}
      {...props}
    />
    <SwitchBackground data-component="SwitchBackground">
      <SwitchToggle data-component="SwitchToggle" />
    </SwitchBackground>
  </SwitchContainer>
);
