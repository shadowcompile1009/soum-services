import * as yup from 'yup';

export const promoCodeSchema = yup.object().shape({
  code: yup.string().when('totalCodes', {
    is: (val: number) => !val || val < 2,
    then: (schema) =>
      schema
        .required('Code name is required')
        .min(2, 'Name should not be less than 2 letters or numbers')
        .max(15, 'Name should not exceed 15 letters or numbers')
        .matches(
          /^[A-Za-z0-9]+$/,
          'Promo code can only contain letters and numbers'
        ),
    otherwise: (schema) => schema.nullable(),
  }),
  bulkPrefix: yup.string().when('totalCodes', {
    is: (val: number) => val >= 2,
    then: (schema) =>
      schema
        .required('Prefix name is required')
        .matches(
          /^[A-Za-z0-9]{3}$/,
          'Prefix must be exactly 3 alphanumeric characters'
        ),
    otherwise: (schema) => schema,
  }),
  promoType: yup
    .string()
    .oneOf(['Percentage', 'Fixed'], 'Please select a discount type')
    .required('Discount type is required'),
  amount: yup.string().required('Amount is required'),
  discount: yup.string().when('promoType', {
    is: 'Percentage',
    then: (schema) => schema.required('Discount is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  promoLimit: yup.string().required('Minimum spend limit is required'),
  fromDate: yup
    .string()
    .required('Start date is required')
    .test('start-date', 'Start date cannot be in the past', (value) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(value) >= today;
    }),
  toDate: yup
    .string()
    .required('End date is required')
    .test(
      'end-date',
      'End date must be equal to or after start date',
      function (value) {
        const { fromDate } = this.parent;
        if (!fromDate || !value) return true;
        return new Date(value) >= new Date(fromDate);
      }
    )
    .test('end-date', 'End date cannot be in the past', (value) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(value) >= today;
    }),
  promoCodeScopeType: yup.string(),
  ids: yup.string(),
  totalCodes: yup.string(),
  totalAllowedUsage: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .min(1, 'Usage limit must be at least 1'),
  note: yup.string().max(300, 'Note cannot exceed 300 characters'),
});

export type PromoCodeFormData = yup.InferType<typeof promoCodeSchema>;
