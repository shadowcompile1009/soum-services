import { NextApiResponse } from 'next';

export type textTypes =
  | 'headingZero'
  | 'headingOne'
  | 'headingTwo'
  | 'headingThree'
  | 'bigSubtitle'
  | 'baseSubtitle'
  | 'smallSubtitle'
  | 'bigText'
  | 'baseText'
  | 'smallText'
  | 'smallestText'
  | 'regular'
  | 'semibold'
  | 'bold'
  | 'medium'
  | 'smallestText';

export type staticColorTypes =
  | 'static.white'
  | 'static.black'
  | 'static.blue'
  | 'static.purple'
  | 'static.red'
  | 'static.gray'
  | 'static.grays.500'
  | 'static.grays.600'
  | 'static.grays.700'
  | 'static.orange'
  | 'static.grays.10'
  | 'static.grays.600'
  | 'static.blues.500'
  | 'static.blues.400'
  | 'static.greens.300'
  | 'static.reds.100'
  | 'static.reds.300'
  | 'static.brown';

export type colorTypes = staticColorTypes;

export interface ISessionData {
  response: NextApiResponse;
  token: string;
  username: string;
  roleId: string;
  roleName: string;
  userId: string;
}
