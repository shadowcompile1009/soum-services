const creditDeductionInvoicePDF = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Listing Fee Invoice</title>
  <style>
    body {
      padding: 20px;
      line-height: 20px;
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13px;
    }
    .soum-logo-wrapper {
      width: 160px;
      text-align: center;
    }
    .soum-logo {
      width: 113px;
      border-radius: 50%;
    }
    .invoice-box {
      margin: auto;
      width: 100%;
      display: block;
      border: 0px;
      max-width: 1200px;
    }
    .invoice-container {
      background-color: #fff;
    }
    .order-table {
      width: 100%;
      border-spacing: 0;
    }
    .info-wrapper {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
    .eng-inv-info {
      padding: 40px 0 20px;
      border-spacing: 0px;
      border-collapse: collapse;
      width: 40%;
    }
    .ar-inv-info {
      padding: 40px 0 20px;
      border-spacing: 0px;
      border-collapse: collapse;
      width: 40%;
    }
    .eng-inv-info td,
    .ar-inv-info td {
      border: 1px solid black;
    }
    .text-right {
      text-align: right;
    }
    .contact-wrapper {
      display: flex;
      margin: 15px auto
    }
    .seller-table {
      border-spacing: 0;
      padding: 10px 0;
      width: 100%;
      border-collapse: collapse;
      border: 1px solid black;
    }
    .seller-table th {
      text-align: left;
      padding: 4px;
      border-bottom: 1px solid black;
    }
    .seller-table td {
      width: 6rem;
    }
    .seller-table td:first-child {
      font-weight: bold;
      width: 6rem;
    }
    .seller-table td:last-child {
      font-weight: bold;
      width: 6rem;
      text-align: right;
    }
    .border-left {
      border-left: 1px solid black !important;
    }
    .border-none {
      border-collapse: collapse;
      outline: none;
    }
    .summary-section {
      display: grid;
      grid-template-columns: 20% 60% 20%;
    }
    .last-table {
      border-spacing: 0;
      margin: 20px 0;
      width: 100%;
    }
    .last-table td {
      text-align: left;
    }
    .last-table tr:first-child td {
      border-top: 1px solid black;
    }
    .last-table tr td:first-child {
      border-right: 0px;
      border-left: 1px solid black;
    }
    .last-table tr td:last-child {
      border-right: 1px solid black;
    }
    .last-table tr:last-child td {
      font-weight: bold;
      border-top: 1px solid black;
      border-bottom: 1px solid black;
    }
    .fill-gold {
      background-color: #fbbc04 !important;
      padding: 0 !important;
    }
    .date-title {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }
    .date-title b {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      text-align: right;
    }
    .invoice-no-title {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      text-align: center;
    }
    .invoice-no-title-right {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      text-align: right;
    }
    .invoice-no-title b {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }
    .invoice-to-title {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      text-align: left;
    }
    address {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-weight: 400 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }
    .b-address {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }
    .b-city {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }
    .b-postal-code {
      font-family: "Poppins", sans-serif;
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
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      text-align: right;
    }
    .seller-name-strong {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-weight: 400 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }
    .b-pickup-address {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }
    .b-pickup-city {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }
    .b-pickup-postal-code {
      font-family: "Poppins", sans-serif;
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
      padding-top: 20px;
    }
    .table-responsive {
      width: 100%;
      overflow-x: auto;
    }
    .service-title {
      padding: 0 0.2rem;
      background-color: #d8e2f2;
      -webkit-print-color-adjust: exact;
      text-align: left;
      line-height: 1.0;
    }
    .bill-table {
      border-collapse: collapse;
      width: 100%;
    }
    .bill-table th {
      border: 1px solid black;
      height: 65px;
    }
    .bill-table td {
      border: 1px solid black;
    }
    .bill-table tbody tr th {
      text-align: right;
    }
    .bill-table-2 th:first-child {
      border-left: 0px;
    }
    .bill-table-2 td:first-child {
      border-left: 0px;
    }
    .amount-title {
      text-align: right;
      padding: 0.75rem;
      color: #495057;
      background-color: #e9ecef;
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-weight: 400 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }
    .amount-title strong {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }
    .model-name {
      vertical-align: middle;
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-weight: 400 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
      text-align: center;
    }
    .price-title {
      text-align: right;
      vertical-align: top;
      border: 1px solid black;
      font-family: "Poppins", sans-serif;
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
      padding: 0.75rem;
      vertical-align: top;
      border: 1px solid black;
    }
    .shipping-charges {
      text-align: right;
      vertical-align: top;
      border: 1px solid black;
      font-family: "Poppins", sans-serif;
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
      padding: 0.75rem;
      vertical-align: top;
      border: 1px solid black;
    }
    .commission {
      text-align: right;
      vertical-align: top;
      border: 1px solid black;
      font-family: "Poppins", sans-serif;
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
      padding: 0.75rem;
      vertical-align: top;
      border: 1px solid black;
    }
    .vat {
      text-align: right;
      vertical-align: top;
      border: 1px solid black;
      font-family: "Poppins", sans-serif;
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
      padding: 0.75rem;
      vertical-align: top;
      border: 1px solid black;
    }
    .total {
      text-align: right;
      vertical-align: top;
      border: 1px solid black;
      font-family: "Poppins", sans-serif;
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
      padding: 0.75rem;
      vertical-align: top;
      border: 1px solid black;
    }
    .noted-txt {
      direction: ltr;
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-weight: 400 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }
    .noted-txt strong {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      font-weight: 500 !important;
      font-style: normal;
      letter-spacing: normal;
      line-height: normal;
    }
    .bill-title-ar {
      font-family: "Poppins", sans-serif;
      font-size: 27px;
      font-weight: 500 !important;
      font-style: normal;
    }
    .bill-title-en {
      font-family: "Poppins", sans-serif;
      font-size: 15px;
      font-style: normal;
    }
    .payment-status-box {
      font-family: "Poppins", sans-serif;
      font-size: 15px;
      font-style: normal;
      border: solid;
      border-width: thin;
      display: inline-block;
      padding: 8px;
      text-align: center;
    }
    .seller-invoice-table {
      border-spacing: 0 10px;
    }
    .full-width {
      width: 100%;
    }
    .logos {
      text-align: center;
      color: white;
    }
    .fill-header-color {
      background-color: #20124d !important;
      padding: 0 !important;
    }
    .qr {
      width: 135px;
      height: 135px;
      text-align: center;
      position: relative;
    }
    .txt-align-center {
      text-align: center;
    }
    .txt-align-left {
      text-align: left;
    }
    .txt-align-right {
      text-align: right;
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
    .qrcode {
      width: 90%;
      height: 90%;
      position: absolute;
      top: 50%;
      left: 5%;
      transform: translate(0, -50%);
    }
    .page-break {
      page-break-after: always;
    }
    @media print {
      .invoiceTableHeading {
        background-color: #d8e2f2 !important;
        -webkit-print-color-adjust: exact;
      }
      .fill-gold {
        background-color: #fbbc04 !important;
        -webkit-print-color-adjust: exact;
      }
      .fill-header-color {
        background-color: #20124d !important;
        -webkit-print-color-adjust: exact;
      }
    }
    @media print {
      .invoiceTableHeading th {
        color: black !important;
      }
    }
    .test-class-for-table-1 {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    .test-class-for-table-2 {
      display: flex;
      justify-content: space-evenly;
      /* width: 100%; */
    }
  </style>
</head>
<body>
  <div id="orderInvoice-en" class="invoice-box">
    <div class="invoice-container">
      <header>
        <table class="order-table align-items-center border-none">
          <tbody>
            <tr>
              <th class="soum-logo-wrapper">
                <img src="https://soum.sa/assets/images/soumLogo.png" class="soum-logo" alt="logo" />
              </th>
              <th class="logos fill-header-color">
                <p class="text-7 bill-title-ar mb-0">
                  <b> TAX Invoice - فاتورة ضريبية</b>
                </p>
              </th>
              <th class="qr fill-header-color" style="border: none">
                <img src='{{qr_code}}' class="qrcode" alt="qr-code" />
              </th>
            </tr>
          </tbody>
        </table>
      </header>
      <main>
        <div class="info-wrapper">
          <table class="eng-inv-info">
            <tr>
              <td class="">SOUM ORDER ID</td>
              <td class="">{{order_number}}</td>
            </tr>
            <tr>
              <td class="">Invoice No.</td>
              <td class="">{{ZATCA_invoice_number}}</td>
            </tr>
            <tr>
              <td class="">Invoice Date</td>
              <td class="">{{issue_date}}</td>
            </tr>
            <tr>
              <td class="">Date of Supply</td>
              <td class="">{{issue_date}}</td>
            </tr>
          </table>
          <table class="ar-inv-info">
            <tr>
              <td class="">{{order_number}}</td>
              <td class="text-right">رقم طلب سوم</td>
            </tr>
            <tr>
              <td class="">{{ZATCA_invoice_number}}</td>
              <td class="text-right">رقم الفاتورة.</td>
            </tr>
            <tr>
              <td class="">{{issue_date}}</td>
              <td class="text-right">تاريخ إصدار الفاتورة</td>
            </tr>
            <tr>
              <td class="">{{issue_date}}</td>
              <td class="text-right">تاريخ التوريد</td>
            </tr>
          </table>
        </div>
        <div class="contact-wrapper">
          <table class="seller-table">
            <tr>
              <th colspan="3" class="service-title">Seller Information</th>
              <th colspan="3" class="service-title border-left">
                Customer Information
              </th>
            </tr>
            <tr>
              <td class="">Seller Name</td>
              <td class="">SOUM Trading Company شركة تجارة سوم</td>
              <td>البائع اسم</td>
              <td class="border-left">Customer Name</td>
              <td class="">{{bill_to}}</td>
              <td class="border-none">سم العميل</td>
            </tr>
            <tr>
              <td class="">VAT number</td>
              <td class="">310985751500003</td>
              <td>ضريبة القيمة المضافة</td>
              <td class="border-left">VAT number</td>
              <td class="">NA</td>
              <td class="border-none">ضريبة القيمة المضافة</td>
            </tr>
            <tr>
              <td class="">CR#</td>
              <td class="">1010664186</td>
              <td>رقم السجل التجاري</td>
              <td class="border-left">CR#</td>
              <td class="">NA</td>
              <td class="border-none">رقم تسجيل الشركة</td>
            </tr>
            <tr>
              <td class="">Address</td>
              <td class="">
                3924, Al Jadwal 7759, Al Rayan Dist. RIYADH 14212
              </td>
              <td>موقع البائع</td>
              <td class="border-left">Address</td>
              <td class="">{{address}}</td>
              <td class="border-none">موقع</td>
            </tr>
            <tr>
            </tr>
            <tr>
              <td class="">Email</td>
              <td class="">info@soum.sa</td>
              <td>البريد الإلكتروني </td>
              <td class=" border-left">Email</td>
              <td class="">NA</td>
              <td class="border-none">البريد الإلكتروني </td>
            </tr>
            <tr>
              <td class="">Contact</td>
              <td class="">920035039</td>
              <td>اتصال</td>
              <td class="border-left">Contact</td>
              <td class="">{{mobile_number}}</td>
              <td class="border-none">اتصال</td>
            </tr>
          </table>
        </div>
        <strong>Platform Listing Fee - Taxable</strong>
        <div class="card">
          <div class="card-body padding-0">
            <div class="table-responsive">
              <table class="table bill-table">
                <thead class="">
                  <tr class="invoiceTableHeading">
                    <th class="service-title">
                      Nature of<br />
                      good or <br />
                      services
                    </th>
                    <th class="service-title">Unit price</th>
                    <th class="service-title">Quantity</th>
                    <th class="service-title">Discount</th>
                    <th class="service-title">Unit Price after Discount (Taxable Amount)</th>
                    <th class="service-title">
                      <span>Tax Rate</span>
                    </th>
                    <th class="service-title">Tax Amount</th>
                    <th class="service-title">
                      Item subtotal (including VAT)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th class="service-title">
                      طبيعة <br />جيدة أو <br />
                      خدمات
                    </th>
                    <th class="service-title">
                      <br />
                      <br />
                      سعر الوحدة
                    </th>
                    <th class="service-title">
                      <br />
                      <br />
                      كمية
                    </th>
                    <th class="service-title">
                      <br />
                      <br />تخفيض
                    </th>
                    <th class="service-title">
                      <br/>
                      <br/> سعر الوحدة بعد الخصم (المبلغ الخاضع للضريبة)
                    </th>
                    <th class="service-title">
                      <br />
                      <br />معدل الضريبة
                    </th>
                    <th class="service-title">
                      <br />
                      <br />قيمة الضريبة
                    </th>
                    <th class="service-title">
                      <br />
                      العناصر الفرعية <br />(بما في ذلك ضريبة القيمة المضافة)
                    </th>
                  </tr>
                  <tr>
                    <th class="service-title">{{order_detail.device_en}}</th>
                    <td class="model-name">{{order_detail.unit_price}}</td>
                    <td class="model-name">1</td>
                    <td class="model-name">{{order_detail.discount}}</td>
                    <td class="model-name">{{order_detail.unit_price_after_discount}}</td>
                    <td class="model-name">
                      {{order_detail.vat}}
                    </td>
                    <td class="model-name">{{order_detail.tax}}</td>
                    <td class="model-name">{{order_detail.sub_total}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="summary-section">
          <div></div>
          <table class="last-table">
            <tbody>
              <tr>
                <td class="date-title width-3">Total Soum Commission</td>
                <td class="invoice-no-title-right width-3">
                  <b>إجمالي عمولة سوم</b>
                </td>
                <td class="invoice-no-title width-4">
                  0
                </td>
              </tr>
              <tr>
                <td class="date-title width-3">Total Discount</td>
                <td class="invoice-no-title-right width-3">
                  <b>إجمالي الخصم</b>
                </td>
                <td class="invoice-no-title width-4">
                  {{order_detail.discount}}
                </td>
              </tr>
              <tr>
                <td class="date-title width-3">Total Taxable Amount</td>
                <td class="invoice-no-title-right width-3">
                  <b>إجمالي المبلغ الخاضع للضريبة</b>
                </td>
                <td class="invoice-no-title width-4">
                  {{order_detail.unit_price_after_discount}}
                </td>
              </tr>
              <tr>
                <td class="date-title width-3">Total VAT</td>
                <td class="invoice-no-title-right width-3">
                  <b>إجمالي ضريبة القيمة المضافة</b>
                </td>
                <td class="invoice-no-title width-4">
                  {{order_detail.tax}}
                </td>
              </tr>
              <tr>
                <td class="date-title width-3">Total Amount Due</td>
                <td class="invoice-no-title-right width-3">
                  <b>إجمالي المبلغ المستحق</b>
                </td>
                <td class="invoice-no-title width-4">
                  {{order_detail.sub_total}}
                </td>
              </tr>
            </tbody>
          </table>
          <div></div>
        </div>
      </main>
      <footer class="txt-align-center"></footer>
    </div>
  </div>
</body>
</html>
`;
export { creditDeductionInvoicePDF };
