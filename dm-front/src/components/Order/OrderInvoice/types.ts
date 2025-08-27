export type InvoiceDetails = {
  _id: string;
  referNo: string;
  url: string;
  eventName: string;
  orderId: string;
  invoiceTypeCd: string;
  invoiceType: string;
  billType: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type InvoiceDataResponse = {
  data: InvoiceDetails[];
  totalItems: number;
  totalPages: number;
  currentPage: string;
  pageSize: string;
};
