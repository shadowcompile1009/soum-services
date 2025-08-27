import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-headers',
  templateUrl: './question-headers.component.html',
  styleUrls: ['./question-headers.component.scss']
})
export class QuestionHeadersComponent implements OnInit {
  arabicTitle="اعثر علي اجاباتك";
  language = 'ar';
  englishTitle="Find your answers";
showCategoryModel = false;
 categories = [
  {
    
    'titleAR': 'المنصة','titleEN': 'Platform', 'selected':true, 
    
    'showCategoryModel':true, 'tiles':[
    {
    'question_ar':'كيف افتح حساب أو اسجل دخول في المنصة؟',
    'answer_ar':'باستخدام الموقع www.Soum.sa او عن طريق التطبيق.',
    'question_en':'How can I create or login into an account on Soum?',
    'answer_en':'You can sign up or sign in using our website www.Soum.sa or you can use our Mobile app which is avaliable on the App store'
  }
,

{
  'question_ar':'هل منصة سوم موثوقة؟',
  'answer_ar':'نعم. رقم معروف: 164634 ، والمنصة مرخصة من وزارة التجارة والاستثمار',
  'question_en':'Is Soum trustworthy?',
  'answer_en':"Yes. It's licensed by ministry of commerce. Maarouf registration number is: 164634"
},

{
  'question_ar':'أريد تغيير عنواني',
  'answer_ar':'تقدر تغير عنوانك عن طريق صفحة الملف الشخصي',
  'question_en':'How can I change my address?',
  'answer_en':'You can change your address through the profile page.'
},
{ 'question_ar':'كيف أتصل بخدمة العملاء؟',
'answer_ar':'  تقدر تتواصل معنا على 966920035039+ ',
'question_en':'How can I contact customer service?',
'answer_en':'You can contact us at: +966920035039'
}
,
{ 'question_ar':'كيف أتحقق من جميع مشترياتي ومبيعاتي؟',
'answer_ar':'تقدر تشيك على مشترياتك و مبيعاتك في صفحة الملف الشخصي',
'question_en':'How can I track my bought/sold items?',
'answer_en':'You can find your bought/sold items in your profile page'
}
], 'icon':'../../../../../assets/images/setting.svg'},
  {'titleAR': 'الشراء','titleEN': 'Buying', 'selected':false, 'showCategoryModel':false,'tiles':[ {
    'question_ar':'ماذا افعل في حال استلمت جهاز تختلف مواصفاته عن المذكورة في الموقع؟    ',
    'answer_ar':'تقدر ترفع اعتراض و بعد التاكد من صحة اعتراضك نرجع لك فلوسك.',
    'question_en':"What do I do if I receive an item that's not as described?",
    'answer_en':'You can file for a dispute and after checking it you will get your money back.    '
  }

  ,
{ 'question_ar':'هل يوجد خدمة دفع كاش؟ ',
'answer_ar':'حالياً ما نقدم خدمة الدفع كاش عند الاستلام لكن تقدر تدفع عن طريق : فيزا او مدا او اس تي سي باي او ابل باي',
'question_en':'Do you have cash on delivery?',
'answer_en':"We currently don't offer cash on delivery, but you can pay using: Visa, Mada, STC Pay and Apple pay"
}
,
{ 'question_ar':'كم من الوقت يستغرق توصيل طلبي؟',
'answer_ar':'الوقت المتوقع لتوصيل طلبك يعتمد على مدينتك ومدينة البائع. يرجى السماح 2-5 أيام للتسليم.',
'question_en':'When can I expect to recieve my item?',
'answer_en':' The expected delivery time depends on your city and the city of the seller. Please allow 2-5 days for delivery.'
}
,
{ 'question_ar':'ما هي الوجهات التي يتم الشحن إليها من سوم؟',
'answer_ar':'خدمات سوم تغطي جميع مناطق المملكة العربية السعودية',
'question_en':'Which cities can Soum ship to?',
'answer_en':'Soum ships to every city in Saudi Arabia.'
}
,
{ 'question_ar':'من اين يمكنني معرفة تفاصيل طلبي بعد الدفع؟ ',
'answer_ar':'من خلال "طلباتي" في صفحة "المزيد"',
'question_en':'Where can I know my order details after paying?',
'answer_en':'Through "my orders" under "More menu"'
}
,
{ 'question_ar':'ما هي وسائل الدفع المقبولة في سوم؟',
'answer_ar':'تقدر تدفع عن طريق : فيزا او مدا او اس تي سي باي او ابل باي',
'question_en':'What payment methods are accepted in Soum?',
'answer_en':'You can pay using VISA,MADA,STC PAY or APPLE PAY'
}
,
{ 'question_ar':'كيف يمكنني الحصول على خصم ٢٠٠ ريال؟',
'answer_ar':'في حال استخدم شخص كود الخصم حقك يجيك 100 ريال!',
'question_en':'How can I get 200SAR discount? ',
'answer_en':'If someone uses your referral code you can get 200SAR!'
},
{
  'question_ar':'كيف يمكنني استرجاع منتج؟  ',
  'answer_ar':'في حال كان فيه مشكلة بالمنتج تقدر ترفع اعتراض و ترجع المنتج و تستلم الفلوس الي دفعتها',
  'question_en':'How can I return a product?  ',
  'answer_en':"If there's something wrong with the product you ordered you can file a dispute and return the product and get your money back"
},
{
  'question_ar':'من يتكفل برسوم التوصيل من بيت البائع لبيت المشتري؟ ',
  'answer_ar':'سوم تتكفل بجميع رسوم التوصيل من بيت البائع الى بيتك',
  'question_en':"Who covers the cost of shipping from the seller's house to the buyer's house?",
  'answer_en':"Soum covers all shipping fees from the seller's house to your house"
},
{
  'question_ar':'تم سحب المبلغ مني، لكن لم يتم تأكيد عملية الشراء في الموقع',
  'answer_ar':'  تقدر تتواصل معنا على 966920035039+ ',
  'question_en':'Payment amount was taken from my account, but there was no buying confirmation in the website. ',
  'answer_en':'You can contact us at: +966920035039'
}

], 'icon':'../../../../../assets/images/shopping-bag.svg'},
  {'titleAR': 'البيع','titleEN': 'Selling', 'selected':false, 'showCategoryModel':false, 'tiles':[ 
     {
    'question_ar':'كيف أعرض منتجي للبيع على منصة سوم؟ ',
    'answer_ar':'تقدر تعرض منتجك على سوم عن طريق موقعنا www.Soum.sa',
    'question_en':'How can I list my product in Soum?',
    'answer_en':'You can list your product using our website: www.Soum.sa'
  }
  ,
{ 'question_ar':'لم أجد تصنيف مناسب لمنتجي ',
'answer_ar':' حالياً فقط تقدر تبيع منتجات معينة على سوم. لكن تقدر تقترح علينا فتح تصنيف جديد على 966920035039+',
'question_en':"I can't find a category for my product.",
'answer_en':'Currently you can only sell certain categories on Soum. But you can recommend a category for us. Call us at +966920035039'
}
,
{ 'question_ar':'ماذا يحدث بعدما يتم بيع منتجي؟ ',
'answer_ar':'سوم بتستلم المنتج منك و تعطيه للمشتري و توصلك الفلوس بعد التاكد من المنتج',
'question_en':'What happens after I sell a product?',
'answer_en':'Soum will pick up the product and give you your money when the seller checks the product'
},{   'question_ar':'متى يمككني استلام قيمة بيع منتجي؟',
'answer_ar':'عن طريق توفير ايبان حسابك البنكي عند عرض المنتج و سيتم تحويل المبلغ عليه',
'question_en':'When will I get paid?',
'answer_en':'By providing your IBAN while listing the product, and the money will be transferred to your account'
}
,{   'question_ar':'كيف سيصل منتجي للمشتري؟ ',
'answer_ar':'سوم تتكفل بعملية التوصيل كاملة حيث بنستلمه منك و بنوصله للمشتري',
'question_en':'How will my product reach the buyer? ',
'answer_en':'Soum takes care of shipping, we will pick up the product from you and deliver it to the buyer'
}
,{   'question_ar':'كيف يمكنني قبول ورفض السومات؟',
'answer_ar':'من خلال قائمة "المنتجات" تحت صفحة "العمليات"، يمكنك رفض و قبول السومة التابعة للمنتج. ',
'question_en':'How can I accept/reject bids on my products?',
'answer_en':'"My products" under "sales" '
}
,{   'question_ar':'كيف يمكنني تجديد مدة عرض منتجي؟',
'answer_ar':'تقدر تجدد مدة العرض عبر صفحة المنتجات المعروضة',
'question_en':'How can I renew my product listing duration? ',
'answer_en':'You can renew your products from "My products" page'
}
], 'icon':'../../../../../assets/images/tag.svg'},
]
  constructor(
    private router: Router,) { }

  ngOnInit(): void {
        this.language = JSON.parse(JSON.parse(localStorage.getItem('defaultLang'))) || 'ar';
  }
  
  goBack() {
    this.router.navigate(["/profile"]);
  }

  showCategory(cat){
    for(const element of this.categories){
      element.showCategoryModel = false;
      element.selected = false;
    }
    cat.showCategoryModel = true;
    cat.selected = true;
  }
}
