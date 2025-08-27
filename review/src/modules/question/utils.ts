export const toKebabCase = (str: string) =>
  str
    .toLowerCase()
    ?.replaceAll(/[^a-zA-Z0-9\s-]/g, '')
    ?.replaceAll(/\s+/g, '-');
