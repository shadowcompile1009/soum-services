import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private apiService: ApiService, private httpClient: HttpClient) {}
  listImgs = [];
  private listingSub = new BehaviorSubject<any>(this.listImgs);
  public observableListing = this.listingSub.asObservable();
  updatePayout: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadFrontLiners: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  sendListing(loading) {
    this.listingSub.next(loading);
  }
  getProducts(currentPage: number, limit: number, productType: string, searchValue: string) {
    return this.apiService.getApi(endpoint.productList(currentPage, limit, productType, searchValue));
  }

  getTradeInProducts(currentPage: number, limit: number, searchValue: string) {
    return this.apiService.secondEnvgetApi(endpoint.tradeInProductList(currentPage, limit, searchValue));
  }

  getProductDetails(product_id: string) {
    return this.apiService.getApi(endpoint.productDetail(product_id));
  }
  getTradeinProductDetails(product_id: string) {
    return this.apiService.secondEnvgetApi(endpoint.tradeInProductDetails(product_id));
  }
  putTradeinProductStatus(productId: string, payload: {status: string}) {
    return this.apiService.putSecondApi(endpoint.tradeInProductStatus(productId), payload, 1);
  }
  downloadBuyer(order_id: string) {
    return this.apiService.getURLFordownload(endpoint.downloadBuyer(order_id));
  }
  downloadSellerCredit(order_id: string) {
    return this.apiService.getURLFordownload(endpoint.downloadSellerCredit(order_id));
  }
  downloadBuyerCredit(order_id: string) {
    return this.apiService.getURLFordownload(endpoint.downloadBuyerCredit(order_id));
  }
  downloadSeller(order_id: string) {
    return this.apiService.getURLFordownload(endpoint.downloadSeller(order_id));
  }
  deleteQ(comment_id: string) {
    return this.apiService.deleteApi(endpoint.deleteQ(comment_id));
  }
  deleteProduct(product_id: string) {
    return this.apiService.deleteApi(endpoint.deleteProduct(product_id));
  }

  updateProductPrice(productID: string, payload: any) {
    return this.apiService.putSecondApi(endpoint.updateProductPrice(productID), payload, 1);
  }

  logsProductPrice(productID: string) {
    return this.apiService.secondEnvgetApi(endpoint.logsProductPrice(productID));
  }

  getQuestionDetails(question_id: string, ) {
    return this.apiService.secondEnvgetApi(endpoint.getQuestionDetails(question_id));
  }
  getProductQuestions(Prod){
    return this.apiService.secondEnvgetApi(endpoint.getQuestionsPerProduct(Prod));
  }
  saveQuestions(prod , list){
    return this.apiService.putSecondApi(endpoint.sendQuestions(prod), list , 1);
  }
  saveQuestionsAdding( list){
    return this.apiService.secondEnvpostApi(endpoint.sendQuestionsAdd(), list , 1);

  }
  approveProduct(product_id: string, payload: { isApproved: boolean }) {
    return this.apiService.putSecondApi(
      endpoint.approveProduct(product_id),
      payload,
      1
    );
  }

  getOrders(page: number, limit: number, dispute: string, searchValue: string) {
    return this.apiService.getApi(
      endpoint.orderList(page, limit, dispute, searchValue)
    );
  }

  disputeAction(payload: DisputeClosure) {
    return this.apiService.postApi(endpoint.disputeClosure, payload, 1);
  }
  readyPayout(payload) {
    return this.apiService.postApi(endpoint.readyPayout, payload, 1);
  }

  refundOrder(payload){
    return this.apiService.secondEnvpostApi(endpoint.refundOrder, payload, 1);
  }

  getOrderDetail(order_id: string) {
    return this.apiService.getApi(endpoint.orderDetail(order_id));
  }

  getOrderDetailsV2(order_id: string, userType: string) {
    return this.apiService.secondEnvgetApi(endpoint.orderDetails(order_id, userType));
  }


  getOrderPayout(order_id :string){
    return this.apiService.getApi(endpoint.getOrderPayout(order_id));
  }

  getOrderPayoutDetails(order_id: string) {
    return this.apiService.secondEnvgetApi(endpoint.getPayoutOrder(order_id));
  }

  getOrderPayoutHistory(order_id: string) {
    return this.apiService.secondEnvgetApi(endpoint.getHistoryPayout(order_id));
  }

  updateOrderPayout(order_id: string, payload) {
    return this.apiService.putSecondApi(endpoint.updatePayout(order_id), payload, 1);
  }

  confirmPaymentForSeller(order_id: string, payload) {
    return this.apiService.secondEnvpostApi(endpoint.payForSeller(order_id), payload, 1);
  }

  deleteBid(bidID, productID) {
    return this.apiService.deleteApi(endpoint.deleteBid(bidID, productID));
  }
  renewProduct(product_id,days){
    return this.apiService.putApi(endpoint.renewProduct(product_id,days),{},1);
  }

  renewAll(page,limit,mobileNumber,days){
    return this.apiService.putApi(endpoint.renewAll(page,limit,mobileNumber,days),{},1);
  }

  getBanks() {
    return this.apiService.getApi(endpoint.banks);
  }

  getAllDeletedListings(limit, page){
    return this.apiService.secondEnvgetApi(endpoint.getAllDeletedListingProducts(limit, page));
  }

  getAllMisMtachListings(limit, page, productID?: string, paramsType?:string){
    return this.apiService.secondEnvgetApi(endpoint.getAllMisMtachListingProducts(limit, page, productID, paramsType));
  }

  getAllFlaggedListings(limit, page, params){
    return this.apiService.secondEnvgetApi(endpoint.getAllFlaggedListings(limit, page, params));
  }

  getPendingFlaggedListings(limit, page, params){
    return this.apiService.secondEnvgetApi(endpoint.getPendingFlaggedListings(limit, page, params));
  }

  getAllOnholdListings(limit, page){
    return this.apiService.secondEnvgetApi(endpoint.getAllOnholdListingProducts(limit, page));
  }

  getAllReportedListings(limit, page){
    return this.apiService.secondEnvgetApi(endpoint.getAllReportedListingProducts(limit, page));
  }

  deleteOrRejectListingProduct(productId: string, actionType: string, deleteMessage: string) {
    return this.apiService.putSecondApi(endpoint.deleteOrRejectListingProduct(productId, actionType), actionType === 'delete' ? {"reason": deleteMessage}: {"rejected_reasons": deleteMessage}, 1);
  }

  getAllSellerFees(limit: number, page: number, isGetSuccess: boolean) {
    return this.apiService.secondEnvgetApi(endpoint.sellerFees(limit, page, isGetSuccess));
  }

  updateFraudProductStatus(productID: string, statusData: any) {
    return this.apiService.putSecondApi(endpoint.updateFraudProductStatus(productID), statusData, 1);
  }

  deleteProductImages(productId: string, images: any) {
    return this.apiService.putSecondApi(endpoint.deleteProductImage(productId), images, 1);
  }

  updateProductImages(productId: string, images: any) {
    return this.apiService.putSecondApi(endpoint.deleteProductImage(productId), images , 1);
  }

  saveRegaQrRealStateProduct(productId: string, body: any) {
    return this.apiService.microServicePatchApi(endpoint.saveRegaQrRealStateProduct(productId), body, 2);
  }
}

export class DisputeClosure {
  order_id: string;
  dispute_comment: string;
  dispute_validity: string;

  constructor(
    order_id: string,
    dispute_comment: string,
    dispute_validity: string
  ) {
    this.order_id = order_id;
    this.dispute_comment = dispute_comment;
    this.dispute_validity = dispute_validity;
  }
}
