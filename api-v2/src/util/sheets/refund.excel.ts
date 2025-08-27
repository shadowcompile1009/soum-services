import { createExcel } from './excel';

export async function generateRefundOrderSheet(
  refunds: any[],
  title?: string
): Promise<[boolean, any]> {
  try {
    const { workbook, sheet, columnStyle } = createExcel(title);

    sheet.columns = [
      { header: 'Order ID', key: 'id', width: 20, style: columnStyle },
      {
        header: 'Hyper Splits ID',
        key: 'hyper_splits_id',
        width: 25,
        style: columnStyle,
      },
      { header: 'status', key: 'status', width: 20, style: columnStyle },
      {
        header: 'Transaction Timestamp',
        key: 'timestamp',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Refund made by',
        key: 'made_by',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Product Id',
        key: 'product_id',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Product Name',
        key: 'product_name',
        width: 20,
        style: columnStyle,
      },
      { header: 'Variant', key: 'variant', width: 20, style: columnStyle },
      {
        header: 'Buyer Name',
        key: 'buyer_name',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Buyer Phone Number',
        key: 'buyer_phone_number',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'VAT Amount',
        key: 'vat_amount',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Shipping Charges',
        key: 'shipping_charge',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Full amount paid',
        key: 'amount',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Transferred amount',
        key: 'transferred_amount',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Buyer’s payment method',
        key: 'buyer_payment_method',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Refund method',
        key: 'refund_method',
        width: 20,
        style: columnStyle,
      },
    ];

    const rows: any[] = [];
    refunds.forEach((elem: any) => {
      rows.push({
        id: elem.order._id?.toString() || '',
        hyper_splits_id: elem.transaction_id?.toString() || '',
        status: elem.refund_status || '',
        timestamp: elem.transaction_timestamp || '',
        made_by: elem.made_by || '',
        product_id: elem.order.product._id?.toString() || '',
        product_name: elem.order.product.model_id.model_name?.toString() || '',
        variant: elem.order.product.varient_id.varient?.toString() || '',
        buyer_name: elem.order.buyer.name?.toString() || '',
        buyer_phone_number: elem.order.buyer.mobileNumber?.toString() || '',
        vat_amount: elem.order.vat || 0,
        shipping_charge: elem.order.shipping_charge || 0,
        amount: elem.order.grand_total || '',
        transferred_amount: elem.refund_amount || '',
        buyer_payment_method: elem.order.payment_type?.toString() || '',
        refund_method: elem.refund_method?.toString() || '',
      });
    });
    sheet.addRows(rows);
    const buffer = await workbook.xlsx.writeBuffer();

    return [false, buffer];
  } catch (exception) {
    return [true, { message: exception.message, stack: exception.stack }];
  }
}
