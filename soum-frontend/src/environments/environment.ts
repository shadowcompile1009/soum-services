// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebaseConfig: {
    apiKey: 'AIzaSyCAbVZYRmQVCMer79gVUAR2p91OxI0-0aU',
    authDomain: 'soum-qa.firebaseapp.com',
    projectId: 'soum-qa',
    storageBucket: 'soum-qa.appspot.com',
    messagingSenderId: '761090026267',
    appId: '1:761090026267:web:c53d5d8bfdabb5277a81be',
    measurementId: 'G-Z7V6WJKL71'
  },
  production: false,
  adjustEnv: 'sandbox',
  googleTagManagerKey: 'GTM-NKN6SBT',
  secondbaseUrl: 'https://api.staging.soum.sa/api-v2/rest/api/',
  baseUrl: 'https://api.staging.soum.sa/api-v1/api/v1/',
  versionNumber: '0.13.0',
  traceRate: 1.0,
  filterMinRange: 0,
  filterMaxRange: 10000,
  dhlServer: 'https://api-eu.dhl.com/track',
  hyperPayCheckout: 'https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=',
  tabby: {
    checkoutUrl: 'https://checkout.tabby.ai',
    apiKey: 'pk_test_eac09848-4275-4c61-a9a5-ed62a382d1a1',
    merchantCode: 'SoumSA'
  },
  countryCode: [
    {
      name: 'Saudi Arabia',
      iso2: 'sa',
      dialCode: '966'
    },
    {
      name: 'India',
      iso2: 'in',
      dialCode: '91'
    }
  ]
};

// ng s -o --host 192.168.29.205

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
