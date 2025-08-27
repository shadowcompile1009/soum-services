export const getNewConditionName = (product: any) => {
  const old_condition_en = ['like new', 'lightly used', 'fair'];
  const new_condition_en = [
    'Excellent condition',
    'Good condition',
    'Noticeably used',
  ];
  const new_condition_ar = ['حالة ممتازة', 'حالة جيدة', 'إستخدام ملحوظ'];
  const condition_index_en = old_condition_en.indexOf(
    product.grade?.toLowerCase()
  );

  if (condition_index_en > -1) {
    product.grade = new_condition_en[condition_index_en];
    product.grade_ar = new_condition_ar[condition_index_en];
    if (product.arGrade) {
      product.arGrade = product.grade_ar;
    }
  }

  return product;
};
