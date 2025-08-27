const invoiceSellerPDF = `
<!DOCTYPE html>
<html>
        <head>
          <title>Test PDF</title>
          <style>
            body {
              padding: 20px;
              line-height: 20px;
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
              text-align:left;
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
              font-weight:500 !important;
              font-style: normal;
              letter-spacing: normal;
              line-height: normal; 
              text-align:left;
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
              width: 50%;text-align: right;
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
              background-color: #D8E2F2;
              text-align: left;
            }
            .service-title span {
              font-family: 'Poppins', sans-serif;
              font-size: 14px;
              font-weight: normal;
              font-style: normal;
              letter-spacing: normal;
              line-height: normal;
            }
            .service-title span b {
              font-size: 16px;
            }
            .bill-table {
              border-collapse: collapse;
            }
            .bill-table td,th {
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
              font-weight:500 !important;
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
            .seller-invoice-table {
              border-spacing: 0 10px;
            }
            .seller-invoice-table-container {
              width: 100%; 
              border-spacing: 0 10px;
            }
            .full-width {
              width: 100%;
            }
            .logos {
              width: 50%;  
              text-align:center;
            }
            .txt-align-center {
              text-align: center;
            }
            .txt-align-left {
              text-align:left;
            }
            .txt-align-right {
              text-align:left;
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
              margin-top: 10px;
              margin-left: 37%; 
              width: 200px;
            }
            .page-break {
              page-break-after:always;
            }
            @media print {.invoiceTableHeading {
              background-color: #D8E2F2 !important;
              -webkit-print-color-adjust: exact; 
              }}
            @media print {.invoiceTableHeading th {
              color: black !important;
              }}
          </style>
        </head>
        <body>
        <div id="orderInvoice-en" class="invoice-box device-invoice">
          <div class="container-fluid invoice-container">
            <header>
              <table class="rows order_table align-items-center">
                <tbody>
                  <tr>
                    <td class="col-sm--4 mb-4 mb-sm-0 txt-align-left"></td>
                    <td class="col-sm--4 mb-4 mb-sm-0 logos">
                      <span class="text-7 bill-title-ar mb-0">فاتورة  ضريبية - خدمة وساطة</span></br>
                      <span class="text-7 bill-title-en mb-0">Tax invoice - Service Commission</span>
                    </td>
                    <td class="col-sm--4 mb-4 text-sm-lefts txt-align-right"></td>
                  </tr>
                </tbody>
              </table>
              <hr>
            </header>
            <main>
              <table class="rows order_table seller-invoice-table-container">
                <tbody>
                  <tr>
                    <td class="col-4 mb-4 mb-sm-0 date-title width-3"><b> Invoice number</b></td>
                    <td class="col-4 mb-4 mb-sm-0 invoice-no-title width-4">{{tax_invoice_number}}</td>
                    <td class="col-4 mb-4 mb-sm-0 invoice-no-title-right width-3"> <b>رقم الفاتورة</b></td>
                  </tr>
                  <tr>
                    <td class="col-4 mb-4 mb-sm-0 date-title width-3"><b> Invoice issue date</b></td>
                    <td class="col-4 mb-4 mb-sm-0 invoice-no-title width-4">{{issue_date}}</td>
                    <td class="col-4 mb-4 mb-sm-0 invoice-no-title-right width-3"><b>تاريخ اصدار الفاتورة</b></td>
                  </tr>
                  <tr>
                    <td class="col-4 mb-4 mb-sm-0 date-title width-3"><b> Bill to</b></td>
                    <td class="col-4 mb-4 mb-sm-0 invoice-no-title width-4"> {{bill_to}}</td>
                    <td class="col-4 mb-4 mb-sm-0 invoice-no-title-right width-3"> <b>الفاتورة لـ</b></td>
                  </tr>
                  <tr>
                    <td class="col-4 mb-4 mb-sm-0 date-title width-3"><b> Billed from</b></td>
                    <td class="col-4 mb-4 mb-sm-0 invoice-no-title width-4"> {{billed_by_cor}}</td>
                    <td class="col-4 mb-4 mb-sm-0 invoice-no-title-right width-3"> <b>مقدم الخدمة</b></td>
                  </tr>
                  <tr>
                    <td class="col-4 mb-4 mb-sm-0 date-title width-3"><b> Address</b></td>
                    <td class="col-4 mb-4 mb-sm-0 invoice-no-title width-4"> 
                      {{address}}
                    </td>
                    <td class="col-4 mb-4 mb-sm-0 invoice-no-title-right width-3"> <b>العنوان</b></td>
                  </tr>
                </tbody>
              </table>
              </br>

              <div class="card">
                <div class="card-body px-0 padding-0">
                  <div class="table-responsive">
                    <table class="table bill-table full-width">
                      <thead class="thead-light">
                        <tr class="invoiceTableHeading">
                          <th class="service-title"">
                            <span><b>تفاصيل السلع والخدمات </b></br></br> Nature of good or services</span>
                          </th>
                          <th class="service-title"> <span><b>سعر الوحدة </b></br></br> Unit price</span></th>
                          <th class="service-title"> <span><b>الخصم </b></br></br> Discount</span></th>
                          <th class="service-title"> <span><b>سعر الوحدة </b>
                            </br></br> Unit price after discount</span></th>
                          <th class="service-title"> <span><b>الكمية </b></br></br> Quantity</span></th>
                          <th class="service-title"> <span><b>الضريبة </b></br></br> Tax</span></th>
                          <th class="service-title"> 
                            <span><b>المجموع (شامل ضريبة القيمة المضافة) </b>
                              </br></br> Item subtotal (including VAT)</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="model-name">
                            {{commission_detail.commission_ar}}</br></br>
                            {{commission_detail.commission_en}}
                          </td>
                          <td class="model-name">{{commission_detail.unit_price}} </br> SAR ریال </td>
                          <td class="model-name">{{commission_detail.discount}} </br> SAR ریال </td>
                          <td class="model-name">{{commission_detail.unit_price_after_discount}} </br> SAR ریال </td>
                          <td class="model-name">{{commission_detail.quantity}}</td>
                          <td class="model-name">{{commission_detail.tax}} </br> SAR ریال </td>
                          <td class="model-name">{{commission_detail.sub_total}} </br> SAR ریال </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              </br>
              <hr>
                <table class="rows order_table seller-invoice-table full-width">
                  <tbody>
                    <tr>
                      <td class="col-4 mb-4 mb-sm-0 date-title width-3">
                        Penalty Charge
                      </td>
                      <td class="col-4 mb-4 mb-sm-0 invoice-no-title width-4"> 
                        {{penalty_fee}} SAR
                      </td>
                      <td class="col-4 mb-4 mb-sm-0 invoice-no-title-right width-3">
                        <b>رسوم الغرامة</b> 
                      </td>
                    </tr>
                    <tr>
                      <td class="col-4 mb-4 mb-sm-0 date-title width-3">
                        Total taxable amount (excluding VAT)
                      </td>
                      <td class="col-4 mb-4 mb-sm-0 invoice-no-title width-4"> 
                        {{total_taxable_amount}} SAR
                      </td>
                      <td class="col-4 mb-4 mb-sm-0 invoice-no-title-right width-3">
                        <b>الإجمالي الخاضع للضريبة (غير شامل لضريبة القيمة المضافة)</b> 
                      </td>
                    </tr>
                    <tr>
                      <td class="col-4 mb-4 mb-sm-0 date-title width-3">
                        Total VAT
                      </td>
                      <td class="col-4 mb-4 mb-sm-0 invoice-no-title width-4">
                        {{total_vat}} SAR
                      </td>
                      <td class="col-4 mb-4 mb-sm-0 invoice-no-title-right width-3">
                      <b>مجموع ضريبة القيمة </b>
                      </td>
                    </tr>
                    <tr>
                      <td class="col-4 mb-4 mb-sm-0 date-title width-3">
                        Total discount
                      </td>
                      <td class="col-4 mb-4 mb-sm-0 invoice-no-title width-4">
                        {{commission_detail.discount}} SAR
                      </td>
                      <td class="col-4 mb-4 mb-sm-0 invoice-no-title-right width-3">
                      <b>إجمالي الخصم</b>
                      </td>
                    </tr>
                    <tr>
                      <td class="col-4 mb-4 mb-sm-0 date-title width-3">
                        Total amount due
                      </td>
                      <td class="col-4 mb-4 mb-sm-0 invoice-no-title width-4">
                        {{total_amount_due}} SAR
                      </td>
                      <td class="col-4 mb-4 mb-sm-0 invoice-no-title-right width-3">
                      <b>إجمالي المبلغ المستحق</b>
                      </td>
                    </tr>
                    <tr>
                      <td class="col-4 mb-4 mb-sm-0 date-title width-3">
                        Net amount for seller
                      </td>
                      <td class="col-4 mb-4 mb-sm-0 invoice-no-title width-4">
                        {{net_amount}} SAR
                      </td>
                      <td class="col-4 mb-4 mb-sm-0 invoice-no-title-right width-3">
                      <b>المبلغ الصافي للبائع</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr>
                <image src= '{{qr_code}}' class="qrcode"/>
            </main>
            <footer class="text-center mt-4 txt-align-center">
            </footer>
          </div>
        </div>
        </body>
      </html>
`;
export { invoiceSellerPDF };
