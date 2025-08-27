export enum OrderType {
  RIYADH_TO_RIYADH = 'R-R', // also seller is not a soum seller
  RIYADH_TO_OTHER = 'R-O', // also seller is not a soum seller
  SOUM_RIYADH_TO_OTHER = 'S-O', // also seller is a soum seller
  SOUM_RIYADH_TO_RIYADH = 'S-R', // also seller is a soum seller
  OTHER_TO_OTHER = 'CROSS',
  SAME_CITY_BUT_NOT_RIYADH = 'SAME CITY',
  NONE = 'NONE',
}
