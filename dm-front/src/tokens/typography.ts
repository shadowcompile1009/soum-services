/**
 * Pixel Values
 * 0: 0,
 * 1: 13,
 * 2: 16,
 * 3: 18,
 * 4: 30,
 * 5: 50,
 * 6: 60,
 * 7: 76,
 */
export const fontSizes: Record<string, string> = {
  0: '0rem',
  1: '0.8125rem',
  2: '1rem',
  3: '1.125rem',
  4: '1.875rem',
  5: '3.125rem',
  6: '3.75rem',
  7: '4.75rem',
};

fontSizes.headingZero = fontSizes[7];
fontSizes.headingOne = fontSizes[6];
fontSizes.headingTwo = fontSizes[5];
fontSizes.headingThree = fontSizes[4];
fontSizes.bigSubtitle = fontSizes[3];
fontSizes.baseSubtitle = fontSizes[2];
fontSizes.smallSubtitle = fontSizes[1];
fontSizes.bigText = fontSizes[3];
fontSizes.baseText = fontSizes[2];
fontSizes.smallText = fontSizes[1];
fontSizes.smallestText = '0.75rem';

export const fontWeights: Record<string, number> = {
  black: 900,
  bold: 700,
  book: 300,
  light: 200,
  medium: 500,
  regular: 400,
  semibold: 600,
  thin: 150,
  ultrathin: 100,
};

fontWeights.headingZero = fontWeights.bold;
fontWeights.headingOne = fontWeights.semibold;
fontWeights.headingTwo = fontWeights.semibold;
fontWeights.headingThree = fontWeights.semibold;
fontWeights.bigSubtitle = fontWeights.semibold;
fontWeights.baseSubtitle = fontWeights.semibold;
fontWeights.smallSubtitle = fontWeights.semibold;
fontWeights.bigText = fontWeights.regular;
fontWeights.baseText = fontWeights.regular;
fontWeights.smallText = fontWeights.regular;
fontWeights.regular = fontWeights.regular;
fontWeights.semibold = fontWeights.semibold;
fontWeights.bold = fontWeights.bold;
fontWeights.medium = fontWeights.medium;
