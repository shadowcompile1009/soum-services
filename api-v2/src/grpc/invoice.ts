import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/invoice';
import { Container } from 'typedi';

import { DeltaMachineOrderDocument } from '../models/DeltaMachineOrder';
import { DeltaMachineRepository } from '../repositories/deltaMachineRepository';
import { InvoiceRepository } from '../repositories/invoiceRepository';
import {
  GetInvoiceGenerationFlagRequest,
  GetInvoiceGenerationFlagResponse,
} from './proto/v2.pb';
import { CreateInvoiceRequest } from './proto/invoice/CreateInvoiceRequest';
import { CreateInvoiceResponse } from './proto/invoice/CreateInvoiceResponse';

const invoiceRepository = Container.get(InvoiceRepository);
const deltaMachineRepository = Container.get(DeltaMachineRepository);

let host = '0.0.0.0:50064';

if (process.env.NODE_ENV !== 'local') {
  host = `soum-${process.env.INVOICE_SVC}-${process.env.PREFIX}-srv:50051`;
}

const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/invoice.proto'
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const InvoiceGrpcSvc = new proto.invoice.InvoiceService(
  host,
  grpc.credentials.createInsecure()
);

const metadata = new grpc.Metadata();
export const GetInvoiceGenerationFlag = async (
  call: ServerUnaryCall<
    GetInvoiceGenerationFlagRequest,
    GetInvoiceGenerationFlagResponse
  >,
  callback: sendUnaryData<GetInvoiceGenerationFlagResponse>
) => {
  try {
    const { dmoId } = call.request;
    const [, dmoRes] = await deltaMachineRepository.getById(dmoId);
    const dmoDocument = dmoRes?.result as DeltaMachineOrderDocument;
    const orderId = dmoDocument?.toJSON()?.orderId;

    const [, invoiceRes] = await invoiceRepository.getInvoiceWithOrderId(
      orderId,
      'seller'
    );
    const isGenerated = !!invoiceRes?.result;
    callback(null, { isGenerated });
  } catch (error) {
    callback(null, {
      isGenerated: true,
    });
  }
};

export const createInvoice = (
  data: CreateInvoiceRequest
): Promise<CreateInvoiceResponse> => {
  return new Promise((resolve, reject) => {
    InvoiceGrpcSvc.createInvoice(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
};
