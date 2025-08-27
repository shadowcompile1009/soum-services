import React from 'react';

import { Text } from '../Text';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label(props: LabelProps): React.ReactElement {
  const { children, htmlFor } = props;
  return (
    <Text
      fontSize="smallText"
      fontWeight="smallText"
      color="static.gray"
      as="label"
      htmlFor={htmlFor}
    >
      {children}
    </Text>
  );
}
