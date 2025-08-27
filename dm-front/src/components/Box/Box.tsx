import styled from 'styled-components';
import css from '@styled-system/css';

export interface IBoxProps {
  margin?: number;
  marginX?: number;
  marginY?: number;
  marginBottom?: number;
  marginTop?: number; // prefer margin bottom to top
  marginLeft?: number;
  marginRight?: number;
  padding?: number;
  paddingX?: number;
  paddingY?: number;
  paddingBottom?: number;
  paddingTop?: number;
  paddingLeft?: number;
  paddingRight?: number;
  cssProps?: Record<string, unknown>;
}

export const Box = styled.div<IBoxProps>((props) => {
  const cssProps = props.cssProps || ({} as Record<string, unknown>);

  return css({
    margin: nullCheck(props.margin),
    marginX: nullCheck(props.marginX),
    marginY: nullCheck(props.marginY),
    marginBottom: nullCheck(props.marginBottom),
    marginTop: nullCheck(props.marginTop),
    marginLeft: nullCheck(props.marginLeft),
    marginRight: nullCheck(props.marginRight),
    padding: nullCheck(props.padding),
    paddingX: nullCheck(props.paddingX),
    paddingY: nullCheck(props.paddingY),
    paddingBottom: nullCheck(props.paddingBottom),
    paddingTop: nullCheck(props.paddingTop),
    paddingLeft: nullCheck(props.paddingLeft),
    paddingRight: nullCheck(props.paddingRight),
    ...cssProps,
  });
});

const nullCheck = (value: number | undefined) => {
  // 0 is an allowed value, even though it's falsy
  if (typeof value !== 'undefined') return value;
  return null;
};
