import { default as RHToast } from 'react-hot-toast';
import isEmpty from 'lodash.isempty';

type RecordFn = (...options: any) => string;

export const MESSAGES: Record<string, string> = {
  onLoginError: 'Username or password is invalid',
  onListOrdersError: 'Unable to get DM orders',
  onListUpfontError: 'Unable to get Upfront payment',
  onGetOrderDetailsError: 'Unable to get order details',
  onGetUserRolesError: 'Unable to get User Roles',
  onGetWalletDetailsError: 'Unable to get Wallet details',
  onGetOrderDetailError: 'Unable to get order detail',
  onGetEditOrderDetailStatusesError: 'Unable to get order detail statuses',
  onGetNCTReasonsError: 'Unable to get NCT Reasons',
  onGenerateSmsaTrackingError: 'Unable to Generate Reverse Smsa Tracking',
  onGetWithdrawalDetailsError: 'Unable to get withdrawal details',
  onGetWalletTransactionsError: 'Unable to get wallet transactions',
  onGetPaymentHistoryError: 'Unable to get payment history',
  onGetWalletTransactionError: 'Unable to get Wallet Transactions',
  onExportCsvError: 'Unable to receive csv data',
  onUpdateWhatsappSettingSuccess:
    'Whatsapp processing settings successfully updated',
  onUpdateOMAutomationSettingSuccess:
    'OM automation settings successfully updated',
  onUpdateWhatsappSettingError:
    'Could not update whatsapp processing settings successfully',
  onUpdateOMAutomationSettingError:
    'Could not update OM automation settings successfully',
  onUpdateCourierAutomationSettingSuccess:
    'Courier Automation settings successfully updated',
  onUpdateCourierAutomationSettingError:
    'Could not update Courier Automation settings successfully',
  onUpdatePickupSettingSuccess: 'Pickup settings successfully updated',
  onUpdatePickupSettingError: 'Could not update pickup settings successfully',
  onTotpVerifyError: 'Invalid authentication code',
  onEnableMultiFactorError: 'Cannot generate QR Code',
  onEnableMultiAuthSuccess: 'Two-factor authentication enabled',
  onUserAddedSuccessfully: 'User was successfully added',
  onUserAddedError: 'Unable to create new User',
  onEditUserSuccessfully: 'User successfully Updated',
  onEditUserAppSuccessfully: 'App User details successfully Updated',
  onEditUserStatusSuccessfully: 'User status successfully Updated',
  onEditUserError: 'Unable to Update User',
  onToggleWalletSettingSuccess: 'Wallet setting updated successfully',
  onGenerateSmsaTrackingSuccess: 'Generate Reverse Smsa Tracking successfully',
  onToggleWalletSettingError: 'Unable to toggle wallet setting',
  onWalletConfigUpdateSuccess: 'Wallet settings config updated successfully',
  onWalletConfigUpdateError: 'Unable to update wallet settings config',
  onUnauthorizedAccessError: 'Not Authorized',
  onApplyPenaltyFeePenalized:
    'This seller’s security fee is already deducted and penalized',
  onGetPenaltyFeeError: 'Unable to get status of penalty Fee',
  onApplyPenaltyFeeNotSet: 'This seller does not have enough credit to deduct',
  onUpdateNCTReasonSuccess: 'Status was updated successfully',
  onUpdateNCTPenaltySuccess: 'Penalty was updated successfully',
  onUpdateProductRelistingSuccess: 'Product was relisted successfully',
  onUpdateNCTReasonError: 'Unable to Update NCT Reason Status',
  onUpdateNCTPenaltyError: 'Unable to Update Penalty',
  onUpdateProductRelistingError: 'Unable to Relist Product',
  onCreateNCTReasonSuccess: 'NCT Reason was created successfully',
  onCreateNCTReasonError: 'Unable to create NCT Reason',
  onCreateCaptureTransactionSuccess: 'captured transaction successfully',
  onCreateCaptureTransactionError: 'Unable to capture transaction',
  onEmptyStatusNCTReason: "can't set empty NCT Reason",
  onEmptyDeleteRejectReason:
    'Please select a reason for deleting or rejecting a listing 😊',
  onImportVendorsSuccess: 'Vendors was Imported successfully',
  onImportVendorsError: 'Unable to Import Vendors',
  onImportTiersSuccess: 'City Tiers was Imported successfully',
  onImportTiersError: 'Unable to Import City Tiers',
  onImportRulesSuccess: 'Rules was Imported successfully',
  onImportRulesError: 'Unable to Import Rules',
  onApplyActionSuccess: 'Action applied successfully',
  onApplyActionError: 'Action cannot be applied',
  onUpdateFlaggedListingSuccess: 'Listing updated successfully',
  onUpdateListingImageSuccess: 'Listing image updated successfully',
  onUpdateListingInspectionReportSuccess:
    'Listing inspection report updated successfully',
  onListingDeleteSuccess: 'Listing deleted successfully',
  onListingDeleteError: 'Unable to delete listing',
  onUpdateFlaggedListingError: 'Unable to update listing',
  onUpdateListingImageError: 'Unable to update listing image',
  onUpdateListingInspectionReportError:
    'Unable to update listing inspection report',
  onGetPenaltiesError: 'Unable to get Penalties',
  onUpdateImageScoreSuccess: 'Image score updated successfully',
  onUpdateImageScoreError: 'Unable to update image score',
  onUpdateUprankToggleSuccess: 'Uprank toggle changed successfully',
  onUpdateUprankToggleError: 'Unable to change uprank toggle',
  onUpdateProductActivationToggleSuccess: 'Product status updated successfully',
  onUpdateProductActivationToggleError: 'Unable to update product status',
  onAddNewQuestionSuccess: 'Add new question was successful',
  onAddNewQuestionError: 'Add new question was not successful',
  onDeleteQuestionSuccess: 'Delete question was successful',
  onDeleteQuestionError: 'Delete question was not successful',
  onEditQuestionSuccess: 'Edit question was successful',
  onEditQuestionError: 'Edit question was not successful',
  onChangeQuestionError: 'Change order question was not successful',
  onChangeQuestionSuccess: 'Change order question was successful',
  onAddNewAddonSuccess: 'Addon was created successfully',
  onAddNewAddonError: 'Addon was not created successfully',
  onDeleteAddonError: 'Addon was not deleted successfully',
  onDeleteAddonSuccess: 'Addon was deleted successfully',
  onUpdateAddonSuccess: 'Addon was edited successfully',
  onUpdateAddonError: 'Addon was not edited successfully',
  onUpdateSpecificationError: 'Your changes have not been saved successfully!',
  onUpdateSpecificationSuccess: 'Your changes have been saved successfully!',
  onUpdatePromocodeError: 'Promocode was not updated successfully',
  onUpdatePromocodeSuccess: 'Promocode was updated successfully',
  onDeletePromocodeError: 'Promocode was not deleted successfully',
  onDeletePromocodeSuccess: 'Promocode was deleted successfully',
  onGeneratePromocodeError: 'Promocode was not generated successfully',
  onGeneratePromocodeSuccess: 'Promocode was generated successfully',
  onUpdateProductConditionSuccess: 'Product condition was updated successfully',
};

export const FN_MESSAGES: Record<string, RecordFn> = {
  onOrderStatusUpdateError(orderId: string) {
    return `Unable to update status of order: ${orderId}`;
  },
  onUpfrontStatusUpdateError(orderId: string) {
    return `Unable to update status of Upfront payment: ${orderId}`;
  },
  onOrderStatusUpdateSuccess(orderId: string) {
    return `Order: ${orderId} status successfully updated`;
  },
  onUpfrontStatusUpdateSuccess(orderId: string) {
    return `Upfront Payment: ${orderId} status successfully updated`;
  },
  onPenaltyFeeError(orderId: string) {
    return `Unable to deduct penalty fee: ${orderId}`;
  },
  onBuyerRefundError(orderId: string) {
    return `Unable to make a refund for Order: ${orderId}`;
  },
  onToWalletRefundError() {
    return `Unable to make a refund for this Order`;
  },
  onBuyerRefundSuccess(orderId: string) {
    return `Refund to ${orderId} was successful`;
  },
  onCancelPayoutSuccess(orderId: string) {
    return `Cancel Payout to ${orderId} was successful`;
  },
  onClosePaymentSuccess(orderId: string) {
    return `Tabby closing to ${orderId} was successful`;
  },
  onApplyPenaltyFeeSuccess(orderId: string) {
    return `Apply fee to ${orderId} was successful`;
  },
  onSellerPayoutError(orderId: string) {
    return `Unable to make a payment for Order: ${orderId}`;
  },
  onSellerPayoutSuccess(orderId: string) {
    return `Payout to ${orderId} was successful`;
  },
  onSellerToWalletPayoutSuccess(orderId: string) {
    return `Payout to ${orderId} was successful`;
  },
  onSellerEditPayoutError(orderId: string) {
    return `Unable to edit payout details for the Order: ${orderId}`;
  },
  onSellerEditPayoutWalletCreditError(orderId: string) {
    return `Unable to edit payout details for the Order: ${orderId}`;
  },
  onSellerEditPayoutSuccess(orderId: string) {
    return `Order: ${orderId} was successfully updated `;
  },
  onSellerEditPayoutWalletCreditSuccess(orderId: string) {
    return `Order: ${orderId} was successfully updated `;
  },
  onSubmitWithdrawalRequestError(requestId: string) {
    return `Request ${requestId} was not successful`;
  },
  onSubmitWithdrawalRequestSuccess(requestId: string) {
    return `Request ${requestId} was submitted`;
  },
  onDeleteUser(username: string) {
    return `User: ${username} was successfully deleted `;
  },
  onDeleteUserError(username: string) {
    return `Unable to delete user: ${username}`;
  },
  onUpdateNCTReasonSuccess() {
    return `Status was updated successfully`;
  },
  onUpdateProductRelistingSuccess() {
    return `Product was relisted successfully`;
  },
  onUpdateNCTReasonError() {
    return `Unable to Update NCT Reason Status`;
  },
  onUpdateProductRelistingError() {
    return `Unable to Relist Product`;
  },
  onCreatePromocodeError(error: string) {
    return error;
  },
  onAddNewQuestionSuccess() {
    return `Add new question was successful`;
  },
  onAddNewQuestionError() {
    return `Add new question was not successful`;
  },
  onDeleteQuestionSuccess() {
    return `Delete question was successful`;
  },
  onDeleteQuestionError() {
    return `Delete question was not successful`;
  },
  onPayoutToSellerDetailsError(orderId: string) {
    return `Unable to get payout to seller details for the Order: ${orderId}`;
  },
  onPayoutToSellerError() {
    return `Unable to payout to seller`;
  },
  onPayoutToSellerSuccess() {
    return `Payout to seller was successful`;
  },
};

type Message = keyof typeof MESSAGES | keyof typeof FN_MESSAGES;
class Toast {
  error(message: string) {
    RHToast.error(message, { duration: 500 });
  }
  success(message: string) {
    RHToast.success(message, { duration: 800 });
  }

  getMessage(message: Message, ...options: any): string {
    if (!isEmpty(options)) {
      return FN_MESSAGES[message](options);
    }

    return MESSAGES[message];
  }
}

export const toast = new Toast();
