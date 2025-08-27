import React, { useState } from 'react';
import styled from 'styled-components';
import { Switch } from '../Switch/Switch';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #f8fafa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  padding: 0 10px;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

const ArLabel = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const EnLabel = styled.span`
  font-size: 14px;
  color: grey;
  padding-left: 6px;
`;

const InputContainer = styled.div`
  flex: 1;
  margin-left: 16px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 8px;
  background-color: #fff;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
`;

interface FormFieldProps {
    group: string;
    enLabel: string;
    arLabel: string;
    status: boolean;
    value: string;
    toggleClickHandler: any;
    handleInputChange: any;
}
const FormField = (props: FormFieldProps) => {
  const { group, enLabel, arLabel, status, value, handleInputChange, toggleClickHandler } = props;
  const [isDisabled, setIsDisabled] = useState<boolean>(!status);
  const [inputValue, setInputValue] = useState<string>(value);

  const handleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    handleInputChange(event);
  };

  return (
    <Container>
      <LabelContainer>
        <div>
          <ArLabel>{arLabel}</ArLabel>
          <EnLabel>{enLabel}</EnLabel>
        </div>
        <ToggleContainer>
          <Switch
            data-inspection-type={group}
            id={enLabel}
            defaultOn={status}
            onClick={(event: React.ChangeEvent<HTMLInputElement>) => {
              setIsDisabled(!event.target.checked)
              toggleClickHandler(event);
            }}
          />
        </ToggleContainer>
      </LabelContainer>
      {!isDisabled && (
        <InputContainer>
          <Input placeholder="Write here" disabled={isDisabled} value={inputValue} onChange={handleValue} name={enLabel} />
        </InputContainer>
      )}
    </Container>
  );
};

export default FormField;
