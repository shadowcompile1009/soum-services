declare module NodeJS {
  interface Global {
    BASE_URL: Readonly<string>;
    Locale: string;
  }
}
