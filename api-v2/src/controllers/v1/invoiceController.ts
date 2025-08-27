import { Request, Response, Router } from 'express';
import { param, body, validationResult } from 'express-validator';
import Mustache from 'mustache';
import { OrderService } from '../../services/orderService';
import Container from 'typedi';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { generatePDF } from '../../libs/generatePDF';
import { AuthGuard } from '../../middleware/authGuard';
import { ListingFeeInput } from '../../models/Invoice';
import { InvoiceService } from '../../services/invoiceService';
import { listingFeeInvoice } from '../../templates/listingFeeInvoice';
import IController from './IController';
import { creditDeductionInvoicePDF } from '../../templates/creditDeductionInvoice';
import { uploadInvoice } from '../../libs/multer';
import { formatPriceInDecimalPoints } from '../../util/common';
import { securityDeductionInvoicePDF } from '../../templates/securityDeductionInvoice';

export class InvoiceController implements IController {
  path = 'invoice/';
  router: Router;
  invoiceService: InvoiceService;
  orderService: OrderService;
  constructor(router: Router) {
    this.router = router;
    this.invoiceService = Container.get(InvoiceService);
    this.orderService = Container.get(OrderService);
  }
  initializeRoutes() {
    this.router.get(
      '/credit-deduction/:order_id',
      [
        // AuthGuard,
        param('order_id')
          .trim()
          .notEmpty()
          .withMessage(
            'order_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getCreditDeductionInvoice
    );
    this.router.post(
      '/listing-fee',
      [
        AuthGuard,
        body('seller_id')
          .not()
          .isEmpty()
          .withMessage(
            'seller_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.addListingInvoice
    );
    this.router.put('/generate', this.generateOldInvoices);
    this.router.get(
      '/security-deduction/transaction/:transactionId/order/:orderId',
      [
        AuthGuard,
        param('transactionId')
          .trim()
          .notEmpty()
          .withMessage(
            'transactionId' +
              Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        param('orderId')
          .trim()
          .notEmpty()
          .withMessage(
            'orderId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getSecurityDeductionInvoice
    );
  }
  mappingListingFeeInvoiceInput(req: Request) {
    const invoiceInput: ListingFeeInput = {
      seller_id: req.body.seller_id,
      service_en: req.body.service_en || 'Commission',
      service_ar: req.body.service_ar || 'وساطة بیع منتج خلال',
      unit_price: formatPriceInDecimalPoints(req.body.unit_price, 3),
      discount: formatPriceInDecimalPoints(req.body.discount, 3),
      unit_price_after_discount: formatPriceInDecimalPoints(
        req.body.unit_price_after_discount,
        3
      ),
      quantity: req.body.quantity,
      tax: formatPriceInDecimalPoints(Number(req.body.tax) * 100, 1),
      item_subtotal: formatPriceInDecimalPoints(req.body.item_subtotal, 3),
      total_taxable_amount: formatPriceInDecimalPoints(
        req.body.total_taxable_amount,
        3
      ),
      total_vat: formatPriceInDecimalPoints(req.body.total_vat, 3),
      total_discount: formatPriceInDecimalPoints(req.body.total_discount, 3),
      total_amount_due: formatPriceInDecimalPoints(
        req.body.total_amount_due,
        3
      ),
    };
    return invoiceInput;
  }

  addListingInvoice = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            JSON.stringify(errors.array())
          )
        );
      }

      const input = this.mappingListingFeeInvoiceInput(req);
      const [err, invoiceResult] =
        await this.invoiceService.addListingFeeInvoice(input);
      if (err || !invoiceResult.result) {
        return res.sendError(
          new ErrorResponseDto(
            invoiceResult.code || Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            invoiceResult.message
          )
        );
      }
      const dataNeedsForInvoice = {
        ...input,
        ...invoiceResult.result,
      };

      const output = Mustache.render(listingFeeInvoice, dataNeedsForInvoice);
      const pdf = await generatePDF(output);

      uploadInvoice(`${dataNeedsForInvoice.id}-seller-INV-V1.pdf`, pdf).then(
        invoiceUrl => {
          this.invoiceService.updateInvoiceUrls(dataNeedsForInvoice.id, [
            String(invoiceUrl),
          ]);
        }
      );

      res.set('Content-Type', 'application/pdf');
      res.send(pdf);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            exception.message
          )
        );
      }
    }
  };

  generateOldInvoices = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            JSON.stringify(errors.array())
          )
        );
      }
      const ordersId = await this.orderService.getOrdersToGenerateInvoices();
      res.send(ordersId);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            exception.message
          )
        );
      }
    }
  };
  getSecurityDeductionInvoice = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            JSON.stringify(errors.array())
          )
        );
      }
      const transactionId = req.params.transactionId || null;
      const orderId = req.params.orderId || null;
      const [err, invoiceDetails] =
        await this.orderService.getSecurityDeductionInvoiceDetail(
          transactionId,
          orderId
        );
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            invoiceDetails.toString()
          )
        );
      }
      const output = Mustache.render(
        securityDeductionInvoicePDF,
        invoiceDetails
      );
      const pdf = await generatePDF(output, { width: 900, height: 1400 });
      res.set('Content-Type', 'application/pdf');
      res.send(pdf);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            exception.message
          )
        );
      }
    }
  };
  getCreditDeductionInvoice = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            JSON.stringify(errors.array())
          )
        );
      }
      const orderId = req.params.order_id || null;
      const [err, orderDetails] =
        await this.orderService.getCreditDeductionInvoiceDetail(orderId);
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            orderDetails.toString()
          )
        );
      }
      const output = Mustache.render(creditDeductionInvoicePDF, orderDetails);
      const pdf = await generatePDF(output, { width: 900, height: 1400 });
      res.set('Content-Type', 'application/pdf');
      res.send(pdf);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            exception.message
          )
        );
      }
    }
  };
}
