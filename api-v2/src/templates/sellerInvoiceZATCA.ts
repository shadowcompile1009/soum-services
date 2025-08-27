const ZATCAinvoiceSellerPDF = `
<!DOCTYPE html>
<html>

<head>
  <title>Test PDF</title>
  <style>
    body {
      padding: 20px;
      line-height: 20px;
    }
    .height{
      height: 50px;
    }
     .ar{
      direction: rtl;
     }
    .color-imgs {
      background-color: white;
      color: black;
      font-size: 16px;
      height: 50px;
      width: 700px;
      padding: 20px;
      text-align: center;
    }

    .container-table {
      display: flex;
      justify-content: space-between;

    }

    .simple-table {

      border: 1px solid black;
      border-collapse: collapse;

    }
    .table-header-color {
      background-color: #d9d2e9 !important;
    }

    .invoice-box {
      margin: auto;
      width: 100%;
      display: block;
      border: 0px;
    }

    .invoice-container {
      max-width: 850px;
      background-color: #fff;
    }

    .order_table {
      width: 100%;
    }

    .date-title {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      text-align: center;
    }

    .date-title b {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      text-align: right;

    }

    .invoice-no-title {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      text-align: center;
    }

    .invoice-no-title-right {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      text-align: right;
    }

    .invoice-no-title b {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }

    .invoice-to-title {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      text-align: left;
    }

    address {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 400 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }

    .b-address {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }

    .b-city {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }

    .b-postal-code {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }

    .pay-to-title {
      width: 50%;
      text-align: right;
    }

    .pay-to-title strong {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      text-align: right;
    }

    .seller-name-strong {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 400 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }

    .b-pickup-address {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }

    .b-pickup-city {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }

    .b-pickup-postal-code {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }

    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: 0;
      word-wrap: break-word;
      background-color: #fff;
      background-clip: border-box;
    }

    .table-responsive {
      display: block;
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .service-title {
      width: 125px;
      padding: .75rem;

      text-align: center;
    }

    .service-title span {
      font-family: 'Poppins', sans-serif;
      font-size: 12px;
      font-style: normal;
      font-weight: normal;
      letter-spacing: normal;
      line-height: normal;
    }

    .service-title span b {
      font-size: 16px;
    }

    .bill-table {
      border-collapse: collapse;
    }

    .bill-table td,
    th {
      border: 1px solid black;
    }

    .amount-title {
      text-align: right;
      padding: .75rem;
      color: #495057;
      background-color: #e9ecef;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 400 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }

    .amount-title strong {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }

    .model-name {
      vertical-align: middle;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 400 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      text-align: center;
    }

    .model-name b {
      font-size: 15px;
    }

    .price-title {
      text-align: right;
      vertical-align: top;
      border: 1px solid black;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      background-color: #f8f8fa !important;
      font-size: 14px;
      padding-top: 8px;
      padding-bottom: 8px;
    }

    .sar-amount {
      text-align: right;
      background-color: #f8f8fa !important;
      font-size: 14px;
      padding-top: 8px;
      padding-bottom: 8px;
      padding: .75rem;
      vertical-align: top;
      border: 1px solid black;
    }

    .shipping-charges {
      text-align: right;
      vertical-align: top;
      border: 1px solid black;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      background-color: #f8f8fa !important;
      font-size: 14px;
      padding-top: 8px;
      padding-bottom: 8px;
    }

    .shipping-charges-value {
      text-align: right;
      background-color: #f8f8fa !important;
      font-size: 14px;
      padding-top: 8px;
      padding-bottom: 8px;
      padding: .75rem;
      vertical-align: top;
      border: 1px solid black;
    }

    .commission {
      text-align: right;
      vertical-align: top;
      border: 1px solid black;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      background-color: #f8f8fa !important;
      font-size: 14px;
      padding-top: 8px;
      padding-bottom: 8px;
    }

    .commission-sar {
      text-align: right;
      background-color: #f8f8fa !important;
      font-size: 14px;
      padding-top: 8px;
      padding-bottom: 8px;
      padding: .75rem;
      vertical-align: top;
      border: 1px solid black;
    }

    .vat {
      text-align: right;
      vertical-align: top;
      border: 1px solid black;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      background-color: #f8f8fa !important;
      font-size: 14px;
      padding-top: 8px;
      padding-bottom: 8px;
    }

    .vat-sar {
      text-align: right;
      background-color: #f8f8fa !important;
      font-size: 14px;
      padding-top: 8px;
      padding-bottom: 8px;
      padding: .75rem;
      vertical-align: top;
      border: 1px solid black;
    }

    .total {
      text-align: right;
      vertical-align: top;
      border: 1px solid black;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      background-color: #f8f8fa !important;
      font-size: 14px;
      padding-top: 8px;
      padding-bottom: 8px;
    }

    .grand-total {
      text-align: right;
      background-color: #f8f8fa !important;
      font-size: 14px;
      padding-top: 8px;
      padding-bottom: 8px;
      padding: .75rem;
      vertical-align: top;
      border: 1px solid black;
    }

    .noted-txt {
      direction: ltr;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 400 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }

    .noted-txt strong {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }

    .bill-title-ar {
      font-family: 'Poppins', sans-serif;
      font-size: 27px;
      font-weight: 500 !important;
      font-style: normal;
    }

    .bill-title-en {
      font-family: 'Poppins', sans-serif;
      font-size: 15px;
      font-style: normal;
    }

    .buyer-invoice-table {
      border-spacing: 0 10px;
    }

    .buyer-invoice-table-container {
      width: 100%;
      border-spacing: 0 10px;
    }

    .full-width {
      width: 100%;
    }

    .logos {
      width: 50%;
      text-align: center;
    }

    .txt-align-center {
      text-align: center;
    }

    .txt-align-left {
      text-align: left;
    }

    .txt-align-right {
      text-align: left;
    }

    .width-3 {
      width: 30%;
    }

    .width-4 {
      width: 40%;
    }

    .padding-0 {
      padding: 0px;
    }

    .page-break {
      page-break-after: always;
    }

    @media print {
      .invoiceTableHeading {
        background-color: #D8E2F2 !important;
        -webkit-print-color-adjust: exact;
      }
    }

    @media print {
      .invoiceTableHeading th {
        color: black !important;
      }
    }
    td{
      padding: 5px;
    }
  </style>
</head>

<body>
  <div id="orderInvoice-en" class="invoice-box">
    <div class="container-fluid invoice-container">
      <header>
        <table class="simple-table">
          <tr>
            <td class="simple-table">
              <image src='{{soum_logo}}' width="50" height="50"  />
            </td>
            <td class="color-imgs ar" >فاتورة ضريبية - TAX Invoice</td>
            <td class="simple-table">
              <image src='{{qr_code}}' width="50" height="50" />
            </td>
          </tr>
        </table>
        <br>
        <div class="container-table">


          <table class="simple-table">
            <tr>
              <td class="simple-table">SOUM ORDER ID</td>
              <td class="simple-table">{{order_number}}</td>
            </tr>
            <tr>
              <td class="simple-table">Invoice No.</td>
              <td class="simple-table">{{ZATCA_invoice_number}}</td>
            </tr>
            <tr>
              <td class="simple-table">Invoice Date</td>
              <td class="simple-table">{{issue_date}}</td>
            </tr>
            <tr>
              <td class="simple-table">Date of Supply</td>
              <td class="simple-table">{{date_of_supply}}</td>
            </tr>

          </table>

          <table class="simple-table">
            <tr>
              <td class="simple-table">{{order_number}}</td>

              <td class="simple-table ar">رقم طلب سوم</td>
            </tr>
            <tr>
              <td class="simple-table">{{ZATCA_invoice_number}}</td>

              <td class="simple-table ar">رقم الفاتورة</td>
            </tr>
            <tr>
              <td class="simple-table">{{issue_date}}</td>

              <td class="simple-table ar">تاريخ إصدار الفاتورة</td>
            </tr>
            <tr>
              <td class="simple-table">{{date_of_supply}}</td>

              <td class="simple-table ar">تاريخ التوريد</td>
            </tr>

          </table>
        </div>
        <br>
        <div class="container-table">


          <table class="simple-table" style="width: 50%;">
            <tr class="simple-table table-header-color">
              <td class="simple-table height"> <b>Seller Information</b> </td>
              <td  class="simple-table height"></td></td>
              <td class="ar simple-table height" ><b>معلومات البائع
              </b></td>
            </tr>
            <tr>
              <td class="simple-table height">Seller Name</td>
              <td class="simple-table height">SOUM Trading Company شركة منصةسوم للتجارة </td>
              <td class="ar simple-table height"> الاسم </td>
            </tr>
            <tr>
              <td  class="simple-table height">VAT number</td>
              <td  class="simple-table height">310985751500003</td>
              <td class="ar simple-table height"> الرقم الضریبي </td>
            </tr>
            <tr>
              <td class="simple-table height">CR number</td>
              <td class="simple-table height">1010664186 </td>
              <td class="ar simple-table height"> السجل التجاري</td>
            </tr>
            <tr>
              <td class="simple-table height">Address</td>
              <td class="simple-table height">9075, Al Jadwal, 3743 King Khalid Internation Airport,
              13413, Riyadh, Kingdom of Saudi Arabia </td>
              <td class="ar simple-table height"> العنوان  </td>
            </tr>
            <tr>
              <td class="simple-table height">Email</td>
              <td class="simple-table height">info@soum.sa</td>
              <td class="ar simple-table height">البريد الإلكتروني </td>
            </tr>
            <tr>
              <td class="simple-table height">Contact</td>
              <td class="simple-table height">920035039</td>
              <td class="ar simple-table height"> رقم التواصل </td>
            </tr>
          </table>

          <table class="simple-table" style="width: 50%;">
            <tr class="simple-table table-header-color">
              <td class="simple-table height"> <b>Customer Information </b> </td>
              <td class="simple-table height"></td>
              <td class="ar simple-table height"><b>معلومات العميل
              </b></td>
            </tr>
            <tr>
              <td class="simple-table height"> Seller Name</td>
              <td class="simple-table height">{{bill_to}}</td>
              <td class="ar simple-table height">الاسم </td>
            </tr>
            <tr>
              <td class="simple-table height">VAT</td>
              <td class="simple-table height">{{storeVatNumber}}</td>
              <td class="ar simple-table height"> الرقم الضریبي </td>
            </tr>
            <tr>
              <td class="simple-table height">CR#</td>
              <td class="simple-table height">NA</td>
              <td class="ar simple-table height">  السجل التجاري  </td>
            </tr>
            <tr>
              <td class="simple-table height">Address</td>
              <td class="simple-table height">{{address}}</td>
              <td class="ar simple-table height">  العنوان </td>
            </tr>
            <tr>
              <td class="simple-table height">Email</td>
              <td class="simple-table height">NA</td>
              <td class="ar simple-table height">البريد الإلكتروني </td>
            </tr>
            <tr>
              <td class="simple-table  height">Contact</td>
              <td class="simple-table height">{{mobile_number}}</td>
              <td class="ar simple-table height"> رقم التواصل </td>
            </tr>
          </table>
        </div>
      </header>

      <main>

        <br>
        <div class="container-table"> <b>Commision - Taxable</b>
          <span class="ar">خدمة الوساطة - خاضعة لضريبة القيمة المضافة
        </span>
        </div>

        <div class="card">
          <div class="card-body px-0 padding-0">
            <div class="table-responsive">
              <table class="table bill-table full-width">
                <thead class="thead-light table-header-color">
                  <tr class="invoiceTableHeading">
                    <th class="service-title">
                      <span><b>Nature of
                          goods or
                          services </b></span>
                    </th>
                    <th class="service-title"> <span><b>Listing Price</b> </span></th>
                    <th class="service-title"> <span><b>SOUM Commission</b><strong></span>
                    <th class="service-title"> <span><b>Discount </b>
                      </span></th>
                    <th class="service-title"> <span><b>Unit Price after Discount (Taxable Amount)</b>
                      </span></th>
                    <th class="service-title"> <span><b>Tax Rate</b></span></th>
                    <th class="service-title">
                      <span><b>Tax Amount</b>
                      </span>
                    </th>
                    <th class="service-title">
                      <span><b>Items Subtotal (including VAT)</b></span>
                    </th>

                  </tr>
                </thead>
                <tbody>
                  <tr class="table-header-color">
                    <td class="model-name ar">  تفاصيل السلع والخدمات</br>
                      </br>
                    </td>
                    <td class="model-name ar"> قائمة الأسعار </td>
                    <td class="model-name ar">رسوم منصة سوم </td>
                    <td class="model-name ar">تخفيض</td>
                    <td class="model-name ar">سعر الوحدة بعد الخصم (المبلغ الخاضع للضريبة)</td>
                    <td class="model-name ar">معدل الضريبة </td>
                    <td class="model-name ar">قيمة الضريبة </td>
                    <td class="model-name ar">المجموع (شامل ضريبة القيمة المضافة)
                    </td>
                  </tr>
                  <tr>
                    <td class="model-name">
                      Item listed on Soum </br></br>
                      Marketplace Fee of Listing price وساطة بيع منتج خلال المنصة
                    </td>
                    <td class="model-name">{{order_detail.unit_price}}</br> SAR ریال </td>
                    <td class="model-name">{{commission_detail.unit_price}}</td>
                    <td class="model-name">{{commission_detail.discount}} </br> SAR ریال </td>
                    <td class="model-name">{{commission_detail.unit_price_after_discount}} </br> SAR ریال </td>

                    <td class="model-name">STD 15%</td>
                    <td class="model-name">{{commission_detail.tax}}</br> SAR ریال </td>
                    <td class="model-name">{{commission_detail.sub_total}}</br> SAR ریال </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
   
   
        </br>
        <table class="simple-table " style="float:right ;">
          <tr>
            <td class="simple-table">Penalty Charge</td>
            <td class="ar simple-table">  رسوم الغرامة</td>
            <td class="simple-table">{{penalty_fee}}</td>
          </tr>
          <tr>
            <td class="simple-table">Total Soum Commission</td>
            <td class="ar simple-table">  إجمالي رسوم المنصة</td>
            <td class="simple-table">{{commission_detail.unit_price}}</td>
          </tr>
          <tr>
            <td class="simple-table">Total Discount</td>
            <td class="ar simple-table">إجمالي الخصم</td>
            <td class="simple-table">{{commission_detail.discount}}</td>
          </tr>
          <tr>
            <td class="simple-table">Total Taxable Amount</td>
            <td class="ar simple-table">إجمالي المبلغ الخاضع للضريبة </td>
            <td class="simple-table">{{commission_detail.unit_price_after_discount}}</td>
          </tr>
          <tr>
            <td class="simple-table">Total VAT</td>
            <td class="ar simple-table">إجمالي ضريبة القيمة المضافة</td>
            <td class="simple-table">{{total_vat}}</td>
          </tr>
          <tr style="border-top: 1px solid black;">
            <td class="simple-table">Total Amount Due</td>
            <td class="ar simple-table">إجمالي المبلغ المستحق</td>
            <td class="simple-table">{{commission_detail.sub_total}}</td>
          </tr>

        </table>

      </main>
      <footer class="text-center mt-4 txt-align-center">
      </footer>
    </div>
  </div>

  <br>
  <div class="page-break"></div>
</body>

</html>
`;
export { ZATCAinvoiceSellerPDF };
