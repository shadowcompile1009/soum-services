export const inputStyles = (
  placeholderStyles: Record<string, unknown>,
  padding: Record<string, unknown>
) => ({
  fontFamily:
    "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  height: 38,
  width: '100%',
  fontSize: 'smallText',
  ...padding,
  borderRadius: 4,
  backgroundColor: 'static.white',
  border: '1px solid',
  borderColor: 'static.grays.50',
  color: 'static.black',
  '::-webkit-input-placeholder': placeholderStyles,
  '::-ms-input-placeholder': placeholderStyles,
  '::placeholder': placeholderStyles,
  transition: 'all ease',
  transitionDuration: '200ms',
  appearance: 'none',
  whiteSpace: 'normal',
  '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '&[type=number]': {
    MozAppearance: 'textfield',
  },

  ':hover': {
    border: '1px solid',
    borderColor: 'static.blue',
    outline: 'none !important',
  },
  ':active, :focus': {
    border: '1px solid',
    borderColor: 'static.blue',
    outline: 'none !important',
  },
  ':disabled': {
    opacity: 1,
    borderColor: 'static.grays.50',
    color: 'static.grays.600',
  },
});
