import { Dispatch, SetStateAction } from 'react';

import styled from 'styled-components';
import css from '@styled-system/css';

const ToggleWrapper = styled.div(() =>
  css({
    width: 305,
    height: 52,
    backgroundColor: '#e5e5e5',
    borderRadius: 26,
    cursor: 'pointer',
    padding: '0.3125rem',
    display: 'flex',
    alignItems: 'center',
  })
);

const ToggleButton = styled.div<{ isOn: boolean }>(
  css({
    cursor: 'pointer',
    fontWeight: '600',
    width: 146.2,
    height: 42,
    backgroundColor: 'white',
    borderRadius: 21,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease',
  }),
  (props) => ({
    transform: props.isOn ? 'translateX(9.3rem)' : 'translateX(0)',
  })
);

const NonActiveText = styled.p<{ isOn: boolean }>(
  () =>
    css({
      color: '#7E8CA0',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }),
  (props) => ({
    transform: props.isOn ? 'translateX(-7.2462rem)' : 'translateX(1.5688rem)',
  })
);

type TabSwitchProps = {
  isInvoiceDetails: boolean;
  setIsInvoiceDetails: Dispatch<SetStateAction<boolean>>;
};

export const TabSwitch = ({
  isInvoiceDetails,
  setIsInvoiceDetails,
}: TabSwitchProps) => {
  const toggleSwitch = () => {
    setIsInvoiceDetails(!isInvoiceDetails);
  };

  return (
    <ToggleWrapper onClick={toggleSwitch}>
      <ToggleButton isOn={isInvoiceDetails}>
        {isInvoiceDetails ? 'Invoice Details' : 'Order Details'}
      </ToggleButton>
      <NonActiveText isOn={isInvoiceDetails}>
        {isInvoiceDetails ? 'Order Details' : 'Invoice Details'}
      </NonActiveText>
    </ToggleWrapper>
  );
};
