export const EDIT_ORDER_DETAILS_DEFAULT_VALUES = (
  orderDetails: any,
  mappedNCTReasonById: any
) => ({
  orderStatus: {
    id: orderDetails?.statusId,
    displayName: orderDetails?.orderData?.status,
    name: orderDetails?.orderData?.status?.split(' ').join('-').toLowerCase(),
  },
  nctReason: mappedNCTReasonById,
  nctPenalty: {
    id: 0,
    name: 0,
  },
});