export function numberValidation(e: React.KeyboardEvent) {
  if (
    !/[0-9]/.test(e.key) &&
    !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
  ) {
    e.preventDefault();
  }
}
