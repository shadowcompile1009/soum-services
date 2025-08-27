import { defaultRealEstateSpecificationIcon } from '@src/modules/assets/IconUrl';

const defaultRealEstateSpecificationReport = {
  specification: [
    {
      nameEn: 'Rooms',
      nameAr: 'الغر',
      icon: defaultRealEstateSpecificationIcon.room,
      checks: [
        {
          nameEn: 'Bedrooms',
          nameAr: 'غرف النوم',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.bedRoom,
        },
        {
          nameEn: 'Dining Rooms',
          nameAr: 'غرف الطعام',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.diningRoom,
        },
        {
          nameEn: 'Living Rooms',
          nameAr: 'غرف المعيشة',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.room,
        },
        {
          nameEn: 'Halls',
          nameAr: 'صالات',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.halls,
        },
        {
          nameEn: 'Traditional sitting rooms or lounges',
          nameAr: 'مجالس',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.halls,
        },
      ],
    },
    {
      nameEn: 'Kitchen',
      nameAr: 'المطبخ',
      icon: defaultRealEstateSpecificationIcon.kitchen,
      checks: [
        {
          nameEn: 'Indoor Kitchen',
          nameAr: 'مطبخ داخلي',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.kitchen,
        },
        {
          nameEn: 'Outdoor Kitchen',
          nameAr: 'مطبخ خارجي',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.kitchen,
        },
        {
          nameEn: 'American kitchen',
          nameAr: 'مطبخ أمريكي',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.kitchen,
        },
      ],
    },
    {
      nameEn: 'Bathrooms',
      nameAr: 'دورات المياه',
      icon: defaultRealEstateSpecificationIcon.bathRoom,
      checks: [
        {
          nameEn: 'Bathrooms',
          nameAr: 'دورات المياه',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.bathRoom,
        },
      ],
    },
    {
      nameEn: 'Area',
      nameAr: 'المساحة',
      icon: defaultRealEstateSpecificationIcon.area,
      checks: [
        {
          nameEn: 'Property Area',
          nameAr: 'مساحة البناء',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.area,
        },
        {
          nameEn: 'Land Area',
          nameAr: 'مساحة الأرض',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.area,
        },
        {
          nameEn: 'Height Area',
          nameAr: 'مساحة الطول',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.area,
        },
        {
          nameEn: 'Width Area',
          nameAr: 'مساحة العرض',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.area,
        },
      ],
    },
    {
      nameEn: 'Age and Faces',
      nameAr: 'العمر - الواجهة',
      icon: defaultRealEstateSpecificationIcon.faceAndAge,
      checks: [
        {
          nameEn: 'Property Age',
          nameAr: 'عمر العقار',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.faceAndAge,
        },
        {
          nameEn: 'Property Face',
          nameAr: 'واجهة العقار',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.faceAndAge,
        },
      ],
    },
    {
      nameEn: 'Parking',
      nameAr: 'المواقف',
      icon: defaultRealEstateSpecificationIcon.parking,
      checks: [
        {
          nameEn: 'Indoor Parking',
          nameAr: 'مواقف داخلية',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.parking,
        },
        {
          nameEn: 'Outdoor Parking',
          nameAr: 'مواقف خارجية',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.parking,
        },
      ],
    },
    {
      nameEn: 'Furniture',
      nameAr: 'الأثاث',
      icon: defaultRealEstateSpecificationIcon.furniture,
      checks: [
        {
          nameEn: 'Furnished',
          nameAr: 'مفروش',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.furniture,
        },
        {
          nameEn: 'Unfurnished',
          nameAr: 'غير مفروش',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.furniture,
        },
      ],
    },
    {
      nameEn: 'Location',
      nameAr: 'الموقع',
      icon: defaultRealEstateSpecificationIcon.location,
      checks: [
        {
          nameEn: 'City',
          nameAr: 'المنطقة',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.location,
        },
        {
          nameEn: 'Neighborhood',
          nameAr: 'الحي',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.location,
        },
      ],
    },
    {
      nameEn: 'Floors',
      nameAr: 'الأدوار',
      icon: defaultRealEstateSpecificationIcon.floor,
      checks: [
        {
          nameEn: 'Number of floors',
          nameAr: '"عدد الأدوار "عمارة - فله',
          status: true,
          icon: defaultRealEstateSpecificationIcon.floor,
          value: '',
        },
        {
          nameEn: 'Floor Number',
          nameAr: '"رقم الدور " شقه',
          status: true,
          icon: defaultRealEstateSpecificationIcon.floor,
          value: '',
        },
      ],
    },
    {
      nameEn: 'Payment Plan ( Buy )',
      nameAr: 'خطة الدفع ( البيع )',
      icon: defaultRealEstateSpecificationIcon.payment,
      checks: [
        {
          nameEn: 'Financing',
          nameAr: 'تمويل',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.payment,
        },
        {
          nameEn: 'Cash',
          nameAr: 'كاش',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.payment,
        },
      ],
    },
    {
      nameEn: 'Rent Type',
      nameAr: 'طريقة الدفع',
      icon: defaultRealEstateSpecificationIcon.payment,
      checks: [
        {
          nameEn: 'Annual',
          nameAr: 'يومي ',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.payment,
        },
        {
          nameEn: 'Monthly',
          nameAr: 'شهري',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.payment,
        },
        {
          nameEn: 'Yearly',
          nameAr: 'سنوي',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.payment,
        },
      ],
    },
    {
      nameEn: '(info)',
      nameAr: 'عمائر - كومباوند',
      icon: defaultRealEstateSpecificationIcon.faceAndAge,
      checks: [
        {
          nameEn: 'Unit Availables',
          nameAr: 'شقق متاحة',
          status: true,
          icon: defaultRealEstateSpecificationIcon.faceAndAge,
          value: '',
        },
        {
          nameEn: 'Unit Number',
          nameAr: 'رقم الشقة',
          status: true,
          icon: defaultRealEstateSpecificationIcon.faceAndAge,
          value: '',
        },
        {
          nameEn: 'Compound Number',
          nameAr: 'رقم الكومباوند',
          status: true,
          icon: defaultRealEstateSpecificationIcon.faceAndAge,
          value: '',
        },
      ],
    },
    {
      nameEn: 'Category',
      nameAr: 'الفئة',
      icon: defaultRealEstateSpecificationIcon.category,
      checks: [
        {
          nameEn: 'Individuals',
          nameAr: 'أفراد',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.category,
        },
        {
          nameEn: 'Families',
          nameAr: 'عوائل',
          status: true,
          value: '',
          icon: defaultRealEstateSpecificationIcon.category,
        },
      ],
    },
    {
      nameEn: 'Status',
      nameAr: 'حالة البناء',
      icon: defaultRealEstateSpecificationIcon.faceAndAge,
      checks: [
        {
          nameEn: 'Under Construction',
          nameAr: 'تحت الإنشاء',
          status: true,
          icon: defaultRealEstateSpecificationIcon.faceAndAge,
          value: '',
        },
        {
          nameEn: 'Ready for occupancy',
          nameAr: 'جاهز للإستلام',
          status: true,
          icon: defaultRealEstateSpecificationIcon.faceAndAge,
          value: '',
        },
        {
          nameEn: 'Available',
          nameAr: 'متاح',
          status: true,
          icon: defaultRealEstateSpecificationIcon.faceAndAge,
          value: '',
        },
      ],
    },
    {
      nameEn: 'Obligations on the Property?',
      nameAr: 'هل يوجد التزام على العقار؟',
      icon: defaultRealEstateSpecificationIcon.obligation,
      checks: [
        {
          nameEn: 'Obligations on the Property',
          nameAr: 'يوجد التزام على العقار؟',
          status: true,
          icon: defaultRealEstateSpecificationIcon.obligation,
          value: '',
        },
      ],
    },
  ],
};

export default defaultRealEstateSpecificationReport;
