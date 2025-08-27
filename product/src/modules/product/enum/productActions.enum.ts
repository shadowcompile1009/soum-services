export enum ProductActionsEnum {
  CREATED = 'created',
  // admin actions
  ADMIN_VERIFY_UPDATE = 'adminVerifyUpdate',
  ADMIN_APPROVE_UPDATE = 'adminApproveUpdate',
  ADMIN_REJECT_UPDATE = 'adminRejectUpdate',
  ADMIN_DELETE_UPDATE = 'adminDeleteUpdate',
  ADMIN_SELL_PRICE_UPDATE = 'adminSellPriceUpdate',
  ADMIN_REGA_URL_UPDATE = 'adminRegaUrlUpdate',
  ADMIN_GUARANTEES_URL_UPDATE = 'adminGuaranteesUrlUpdate',
  ADMIN_IMAGE_UPDATE = 'adminImageUpdate',
  ADMIN_DESCRIPTION_UPDATE = "adminDescriptionUpdate",
  ADMIN_BIN_UPDATE = "adminBINUpdate",
  // user actions 
  USER_DELETE_UPDATE = "userDeleteUpdate",
  USER_IMAGE_UPDATE = "userImageUpdate",
  USER_SELL_PRICE_UPDATE = "userSellPriceUpdate",
  USER_DESCRIPTION_UPDATE = "userDescriptionUpdate",
  // sync status , this is just temp till we migrate v2 also 
  SYSTEM_STATUS_UPDATE = "systemStatusUpdate",
  SYSTEM_SOLD_UPDATE = "systemSoldUpdate",
  SYSTEM_SELL_PRICE_UPDATE = 'systemSellPriceUpdate',
  // system actions
}
