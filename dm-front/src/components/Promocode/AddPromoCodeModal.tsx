import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from 'react-select';

import { CommonModal } from '@/components/Modal';
import { FormField, Input, Checkbox } from '@/components/Form';
import { Button } from '@/components/Button';
import { Stack } from '@/components/Layouts';
import { toast } from '@/components/Toast';
import { Promocode } from '@/models/Promocode';

import { useCreateEditMutation } from './hooks/useCreateEditMutation';
import { CloseIcon } from '../Shared/CloseIcon';
import { Text } from '../Text';
import { Box } from '../Box';
import {
  paymentMethodsConfig,
  PaymentProvider,
  PaymentProviderType,
  promoCodeScopeTypeConfig,
} from './constants';

import { TrashIcon } from './assets/TrashIcon';
import { numberValidation } from './helpers';
import { PromoCodeFormData, promoCodeSchema } from './schema';

interface AddPromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  promocode?: Promocode | null;
}

interface PaymentMethod {
  paymentProvider: PaymentProvider;
  paymentProviderType: PaymentProviderType;
}

interface Rule {
  id: string;
  promoCodeScopeType?: string;
  ids?: string;
}

export function AddPromoCodeModal({
  isOpen,
  onClose,
  promocode,
}: AddPromoCodeModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<any>({
    resolver: yupResolver(promoCodeSchema),
  });

  const { mutate: createEditPromocode, isLoading } = useCreateEditMutation();
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<
    PaymentMethod[]
  >([]);
  const [appliedByDefault, setAppliedByDefault] = useState(false);
  const [paymentMethodsError, setPaymentMethodsError] = useState<string | null>(
    null
  );
  const [applicableRules, setApplicableRules] = useState<Rule[]>([{ id: '1' }]);
  const [notApplicableRules, setNotApplicableRules] = useState<Rule[]>([
    { id: '1' },
  ]);
  const [applicableRuleError, setApplicableRuleError] = useState<
    string[] | null
  >();
  const [notApplicableRuleError, setNotApplicableRuleError] = useState<
    string[] | null
  >();

  // Watch note field for character count
  const noteValue = watch('note') || '';
  const promoType = watch('promoType');
  const totalAllowedUsage = watch('totalAllowedUsage', 0);
  const totalCodes = watch('totalCodes', 1);

  const handleAddApplicableRule = () => {
    setApplicableRules([...applicableRules, { id: String(Date.now()) }]);
  };

  const handleNotApplicableRule = () => {
    setNotApplicableRules([...notApplicableRules, { id: String(Date.now()) }]);
  };

  const splitIds = (ids: string) => {
    if (!ids) return [];
    return String(ids)
      .split(',')
      .map((id) => id.trim());
  };

  const onSubmit = (data: PromoCodeFormData) => {
    setApplicableRuleError(null);
    setNotApplicableRuleError(null);
    setPaymentMethodsError(null);

    const amount = Number(data.amount);
    const promoLimit = Number(data.promoLimit);

    // Check if discount is greater than minimum spend limit
    if (data.promoType === 'Fixed') {
      if (amount >= promoLimit) {
        toast.error('Minimum spend limit should be greater than amount.');
        return;
      }
    } else if (data.promoType === 'Percentage') {
      // For percentage type, calculate the actual discount amount
      const actualDiscount = (promoLimit * amount) / 100;

      if (actualDiscount >= promoLimit) {
        toast.error('The percentage value cannot be 100 or more.');
        return;
      }
    }

    if (selectedPaymentMethods.length === 0) {
      setPaymentMethodsError('At least one payment method is required');
      return;
    }

    const payload: Partial<any> = {
      code: data.code,
      bulkPrefix: data.bulkPrefix,
      promoType: data.promoType,
      percentage: data.promoType === 'Percentage' ? Number(data.amount) : 0,
      discount:
        data.promoType === 'Percentage'
          ? Number(data.discount)
          : data.promoType === 'Fixed'
          ? Number(data.amount)
          : 0,
      promoLimit: Number(data.promoLimit),
      fromDate: data.fromDate,
      toDate: data.toDate,
      totalCodes: data.totalCodes ? Number(data.totalCodes) : undefined,
      totalAllowedUsage: data.totalAllowedUsage
        ? Number(data.totalAllowedUsage)
        : undefined,
      note: data.note,
      availablePayment: selectedPaymentMethods,
      isDefault: !disableIsDefaultField() && appliedByDefault,
      promoCodeScope: applicableRules.map((rule) => ({
        promoCodeScopeType: rule.promoCodeScopeType,
        ids: splitIds(rule?.ids as string),
      })),
      excludedPromoCodeScope: notApplicableRules.map((rule) => ({
        promoCodeScopeType: rule.promoCodeScopeType,
        ids: splitIds(rule?.ids as string),
      })),
    };

    if (
      applicableRules.length === 1 &&
      !applicableRules[0].promoCodeScopeType
    ) {
      delete payload.promoCodeScope;
    }

    if (Boolean(totalCodes > 1)) {
      delete payload.code;
    }

    if (!totalCodes) {
      delete payload.bulkPrefix;
    }

    if (
      notApplicableRules.length === 1 &&
      !notApplicableRules[0].promoCodeScopeType
    ) {
      delete payload.excludedPromoCodeScope;
    }

    createEditPromocode(
      {
        data: payload,
        id: promocode?.id,
      },
      {
        onSuccess: () => {
          reset();
          setApplicableRules([{ id: '1' }]);
          setNotApplicableRules([{ id: '1' }]);
          setSelectedPaymentMethods([]);
          setAppliedByDefault(false);
          onClose();
        },
        onError: (error: any) => {
          if (error.response?.data?.promoCodeScope) {
            // Handle specific validation errors for invalid IDs
            const scopeErrors = error.response.data.promoCodeScope;
            setApplicableRuleError(scopeErrors);
          }
          if (error.response?.data?.excludedPromoCodeScope) {
            // Handle specific validation errors for invalid IDs
            const scopeErrors = error.response.data.excludedPromoCodeScope;
            setNotApplicableRuleError(scopeErrors);
          }
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    setPaymentMethodsError(null);
    setSelectedPaymentMethods([]);
    setAppliedByDefault(false);
    setApplicableRules([{ id: '1' }]);
    setNotApplicableRules([{ id: '1' }]);
    onClose();
  };

  const handleDeleteRule = (promoCodeScopeType: string, type: string) => {
    if (type === 'applicable' && applicableRules.length > 1) {
      setApplicableRules(
        applicableRules.filter(
          (rule) => rule.promoCodeScopeType !== promoCodeScopeType
        )
      );
    } else if (type === 'applicable' && applicableRules.length === 1) {
      setApplicableRules([{ id: '1' }]);
    }
    if (type === 'notApplicable' && notApplicableRules.length > 1) {
      setNotApplicableRules(
        notApplicableRules.filter(
          (rule) => rule.promoCodeScopeType !== promoCodeScopeType
        )
      );
    } else if (type === 'notApplicable' && notApplicableRules.length === 1) {
      setNotApplicableRules([{ id: '1' }]);
    }
  };

  function filteredOptions(options: any[]) {
    return promoCodeScopeTypeConfig.filter((type) => {
      // If there's more than one option, exclude the feeds option
      if (options.length > 1) {
        return (
          type.value !== 'feeds' &&
          !options.some((option) => option.promoCodeScopeType === type.value)
        );
      }

      return !options.some(
        (option) => option.promoCodeScopeType === type.value
      );
    });
  }

  const inputStyle = {
    height: '40px',
    borderColor: 'static.grays.700',
  };

  useEffect(() => {
    if (promocode) {
      console.log(' -- promoc', promocode);
      setValue('code', promocode.code);
      setValue('promoType', promocode.promoType);
      setValue(
        'amount',
        promocode.promoType === 'Fixed'
          ? promocode.discount
          : promocode.percentage
      );
      setValue('promoLimit', promocode.promoLimit);
      setValue('fromDate', promocode.fromDate?.split('T')[0]);
      setValue('toDate', promocode.toDate?.split('T')[0]);
      setValue('totalCodes', promocode.totalCodes);
      setValue('totalAllowedUsage', promocode.totalAllowedUsage);
      setValue('note', promocode.note);
      setSelectedPaymentMethods(promocode.availablePayment || []);
      setAppliedByDefault(promocode.isDefault);
      setApplicableRules(
        promocode.promoCodeScope.length >= 1
          ? promocode.promoCodeScope
          : [{ id: '1' }]
      );
      setNotApplicableRules(
        promocode.excludedPromoCodeScope.length >= 1
          ? promocode.excludedPromoCodeScope
          : [{ id: '1' }]
      );
    }
  }, [promocode]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    return () => {
      reset();
      setPaymentMethodsError(null);
      setSelectedPaymentMethods([]);
      setAppliedByDefault(false);
      setApplicableRules([{ id: '1' }]);
      setNotApplicableRules([{ id: '1' }]);
    };
  }, [isOpen]);

  const disableIsDefaultField = () => {
    return (
      Number(totalAllowedUsage) > 0 ||
      Number(totalCodes) > 1 ||
      applicableRules.some((rule) => rule.promoCodeScopeType || rule.ids)
    );
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleClose}
      width={656}
      height={'90%'}
    >
      <Stack direction="horizontal" gap="16" justify="space-between">
        <Text color="static.black" fontSize="regular" fontWeight="semibold">
          {promocode ? 'Edit' : 'Add'} Promo Code
        </Text>
        <button
          onClick={handleClose}
          style={{
            border: 'none',
            margin: '0',
            padding: '0',
            outline: 'none',
          }}
        >
          <CloseIcon />
        </button>
      </Stack>
      <hr />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="vertical">
          {(promocode?.totalCodes || 1) >= 2 ? (
            <Box>
              <Text
                fontWeight="semibold"
                fontSize="regular"
                color="static.gray"
              >
                Prefix Name*
              </Text>
              <FormField
                htmlFor="code-name"
                error={errors.bulkPrefix?.message as string}
              >
                <Input
                  id="code-name"
                  placeholder={'Enter prefix'}
                  defaultValue={promocode?.bulkPrefix || ''}
                  {...register('bulkPrefix', { required: true })}
                  style={inputStyle}
                  disabled={
                    Boolean(promocode?.parentPromoCodeId) ||
                    Boolean(promocode?.totalCodes)
                  }
                />
              </FormField>
            </Box>
          ) : (
            <Box>
              <Text
                fontWeight="semibold"
                fontSize="regular"
                color="static.gray"
              >
                Code Name*
              </Text>
              <FormField
                htmlFor="code-name"
                error={errors.code?.message as string}
              >
                <Input
                  id="code-name"
                  placeholder={'Enter your code'}
                  defaultValue={promocode?.code || ''}
                  {...register('code', { required: true })}
                  style={inputStyle}
                  disabled={Boolean(promocode?.parentPromoCodeId)}
                />
              </FormField>
            </Box>
          )}
          <Box>
            <Text fontWeight="semibold" fontSize="regular" color="static.gray">
              Discount Type*
            </Text>
            <FormField
              htmlFor="discount-type"
              error={errors.promoType?.message as string}
            >
              <Select
                id="discount-type"
                onChange={(option) => {
                  const event = {
                    target: {
                      name: 'promoType',
                      value: option?.value,
                    },
                  };
                  register('promoType', { required: true }).onChange(event);
                }}
                placeholder="Select"
                defaultValue={
                  promocode
                    ? {
                        label: promocode.promoType,
                        value: promocode.promoType,
                      }
                    : null
                }
                options={[
                  { label: 'Percentage', value: 'Percentage' },
                  { label: 'Fixed Amount', value: 'Fixed' },
                ]}
              />
            </FormField>
          </Box>

          <Box>
            <Text fontWeight="semibold" fontSize="regular" color="static.gray">
              {promoType === 'Percentage' ? 'Percentage*' : 'Amount*'}
            </Text>
            <FormField
              htmlFor="amount"
              error={errors.amount?.message as string}
            >
              <Input
                id="amount"
                placeholder="Enter amount"
                defaultValue={
                  (promocode
                    ? promocode.promoType === 'Fixed'
                      ? promocode.discount
                      : promocode.percentage
                    : '') ?? ''
                }
                {...register('amount', {
                  required: true,
                  pattern: {
                    value: /^[0-9]*$/,
                    message: 'Please enter numbers only',
                  },
                })}
                style={inputStyle}
                maxLength={4}
                onKeyDown={numberValidation}
              />
            </FormField>
          </Box>
          {promoType === 'Percentage' && (
            <Box>
              <Text
                fontWeight="semibold"
                fontSize="regular"
                color="static.gray"
              >
                Discount*
              </Text>
              <FormField
                htmlFor="discount"
                error={errors.discount?.message as string}
              >
                <Input
                  id="discount"
                  placeholder="Enter discount"
                  defaultValue={promocode ? promocode.discount : ''}
                  {...register('discount', {
                    required: true,
                    pattern: {
                      value: /^[0-9]*$/,
                      message: 'Please enter numbers only',
                    },
                  })}
                  style={inputStyle}
                  maxLength={4}
                  onKeyDown={numberValidation}
                />
              </FormField>
            </Box>
          )}

          <Box>
            <Text fontWeight="semibold" fontSize="regular" color="static.gray">
              Minimum Spend Limit*
            </Text>
            <FormField
              htmlFor="minimum-spend-limit"
              error={errors.promoLimit?.message as string}
            >
              <Input
                id="minimum-spend-limit"
                placeholder="Enter minimum spend limit"
                defaultValue={promocode?.promoLimit || ''}
                {...register('promoLimit', { required: true })}
                style={inputStyle}
                maxLength={4}
                onKeyDown={numberValidation}
              />
            </FormField>
          </Box>

          <Stack direction="horizontal" gap="16">
            <Box
              cssProps={{
                width: '50%',
              }}
            >
              <Text
                fontWeight="semibold"
                fontSize="regular"
                color="static.gray"
              >
                Start Date*
              </Text>
              <FormField
                htmlFor="start-date"
                error={errors.fromDate?.message as string}
              >
                <Input
                  id="start-date"
                  type="date"
                  placeholder="MM/DD/YYYY"
                  defaultValue={promocode?.fromDate || ''}
                  min={today}
                  {...register('fromDate', { required: true })}
                  style={inputStyle}
                  className="date-input"
                />
              </FormField>
            </Box>
            <Box
              cssProps={{
                width: '50%',
              }}
            >
              <Text
                fontWeight="semibold"
                fontSize="regular"
                color="static.gray"
              >
                End Date*
              </Text>
              <FormField
                htmlFor="end-date"
                error={errors.toDate?.message as string}
              >
                <Input
                  id="end-date"
                  type="date"
                  placeholder="MM/DD/YYYY"
                  min={today}
                  {...register('toDate', { required: true })}
                  style={inputStyle}
                  className="date-input"
                />
              </FormField>
            </Box>
          </Stack>

          <Text
            fontWeight="semibold"
            fontSize="regular"
            color="static.black"
            style={{
              marginBottom: '8px',
            }}
          >
            Rules
          </Text>

          <Text color="static.gray" fontSize="regular" fontWeight="semibold">
            Applicable Rule
          </Text>

          {applicableRules.map((rule, index) => (
            <React.Fragment key={rule.id + index}>
              <Stack
                direction="vertical"
                style={{
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  margin: '8px 0px',
                }}
              >
                <Box>
                  <Text
                    fontWeight="semibold"
                    fontSize="regular"
                    color="static.gray"
                  >
                    Limit Promocode (Optional)
                  </Text>
                  <FormField htmlFor={`limit-promocode-${rule.id}`}>
                    <Select
                      id={`limit-promocode-${rule.id}`}
                      onChange={(option) => {
                        const updatedRules = [...applicableRules];
                        updatedRules[index] = {
                          ...updatedRules[index],
                          promoCodeScopeType: option?.value,
                        };
                        setApplicableRules(updatedRules);
                      }}
                      value={
                        rule.promoCodeScopeType
                          ? {
                              label:
                                rule.promoCodeScopeType === 'feeds'
                                  ? 'Collection ID'
                                  : rule.promoCodeScopeType,
                              value: rule.ids,
                            }
                          : null
                      }
                      placeholder="Select"
                      options={filteredOptions(applicableRules)}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          textTransform: 'capitalize',
                        }),
                      }}
                    />
                  </FormField>
                </Box>
                <Box>
                  <Text
                    fontWeight="semibold"
                    fontSize="regular"
                    color="static.gray"
                  >
                    Enter ID (Optional)
                  </Text>
                  <FormField
                    htmlFor={`enter-id-${rule.id}`}
                    error={
                      rule.promoCodeScopeType &&
                      applicableRuleError?.[rule?.promoCodeScopeType as any]
                    }
                  >
                    <Input
                      id={`enter-id-${rule.id}`}
                      placeholder="Enter ID"
                      value={rule.ids || ''}
                      onChange={(e) => {
                        const updatedRules = [...applicableRules];
                        updatedRules[index] = {
                          ...updatedRules[index],
                          ids: (e.target as HTMLInputElement).value,
                        };
                        setApplicableRules(updatedRules);
                      }}
                      style={inputStyle}
                    />
                  </FormField>
                </Box>
              </Stack>
              {applicableRules.length && (
                <Stack
                  direction="horizontal"
                  style={{
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  {index === applicableRules.length - 1 &&
                    !applicableRules.some(
                      (rule) => rule.promoCodeScopeType === 'feeds'
                    ) && (
                      <Button
                        variant="filled"
                        onClick={handleAddApplicableRule}
                        type="button"
                      >
                        + Add new rule
                      </Button>
                    )}
                  {(applicableRules.length > 1 ||
                    (index === 0 && (rule.promoCodeScopeType || rule.ids))) && (
                    <Button
                      type="button"
                      variant="bordered"
                      onClick={() =>
                        handleDeleteRule(
                          rule.promoCodeScopeType as string,
                          'applicable'
                        )
                      }
                      cssProps={{
                        width: 'fit-content',
                        borderColor: 'static.red',
                        marginLeft: '8px',
                      }}
                    >
                      <TrashIcon />
                    </Button>
                  )}
                </Stack>
              )}
            </React.Fragment>
          ))}

          <Text color="static.gray" fontSize="regular" fontWeight="semibold">
            Not Applicable Rule
          </Text>

          {notApplicableRules.map((rule, index) => (
            <React.Fragment key={rule.id + index}>
              <Stack
                direction="vertical"
                style={{
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  margin: '8px 0px',
                }}
              >
                <Box>
                  <Text
                    fontWeight="semibold"
                    fontSize="regular"
                    color="static.gray"
                  >
                    Limit Promocode (Optional)
                  </Text>
                  <FormField htmlFor={`limit-promocode-${rule.id}`}>
                    <Select
                      id={`limit-promocode-${rule.id}`}
                      onChange={(option) => {
                        const updatedRules = [...notApplicableRules];
                        updatedRules[index] = {
                          ...updatedRules[index],
                          promoCodeScopeType: option?.value,
                        };
                        setNotApplicableRules(updatedRules);
                      }}
                      value={
                        rule.promoCodeScopeType
                          ? {
                              label:
                                rule.promoCodeScopeType === 'feeds'
                                  ? 'Collection ID'
                                  : rule.promoCodeScopeType,
                              value: rule.ids,
                            }
                          : null
                      }
                      placeholder="Select"
                      options={filteredOptions(notApplicableRules)}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          textTransform: 'capitalize',
                        }),
                      }}
                    />
                  </FormField>
                </Box>
                <Box>
                  <Text
                    fontWeight="semibold"
                    fontSize="regular"
                    color="static.gray"
                  >
                    Enter ID (Optional)
                  </Text>
                  <FormField
                    htmlFor={`enter-id-${rule.id}`}
                    error={
                      (notApplicableRuleError &&
                        notApplicableRuleError[index] &&
                        notApplicableRuleError[index]) ||
                      undefined
                    }
                  >
                    <Input
                      id={`enter-id-${rule.id}`}
                      placeholder="Enter ID"
                      value={rule.ids || ''}
                      onChange={(option: any) => {
                        if (option?.value === 'feeds') {
                          setNotApplicableRules([
                            {
                              id: rule.id,
                              promoCodeScopeType: option.value,
                            },
                          ]);
                        } else {
                          const updatedRules = [...notApplicableRules];
                          updatedRules[index] = {
                            ...updatedRules[index],
                            ids: (option.target as HTMLInputElement).value,
                          };
                          setNotApplicableRules(updatedRules);
                        }
                      }}
                      style={inputStyle}
                    />
                  </FormField>
                </Box>
              </Stack>
              {notApplicableRules.length && (
                <Stack
                  direction="horizontal"
                  style={{
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  {index === notApplicableRules.length - 1 &&
                    !notApplicableRules.some(
                      (rule) => rule.promoCodeScopeType === 'feeds'
                    ) && (
                      <Button
                        variant="filled"
                        onClick={handleNotApplicableRule}
                        type="button"
                      >
                        + Add new rule
                      </Button>
                    )}
                  {(notApplicableRules.length > 1 ||
                    (index === 0 && (rule.promoCodeScopeType || rule.ids))) && (
                    <Button
                      type="button"
                      variant="bordered"
                      onClick={() =>
                        handleDeleteRule(
                          rule.promoCodeScopeType as string,
                          'notApplicable'
                        )
                      }
                      cssProps={{
                        width: 'fit-content',
                        borderColor: 'static.red',
                        marginLeft: '8px',
                      }}
                    >
                      <TrashIcon />
                    </Button>
                  )}
                </Stack>
              )}
            </React.Fragment>
          ))}

          {!promocode && (
            <Box>
              <Text
                fontWeight="semibold"
                fontSize="regular"
                color="static.gray"
              >
                Quantity (Optional)
              </Text>
              <FormField
                htmlFor="totalCodes"
                error={errors.totalCodes?.message as string}
              >
                <Input
                  id="totalCodes"
                  placeholder="Enter quantity"
                  {...register('totalCodes')}
                  style={inputStyle}
                  onKeyDown={numberValidation}
                />
              </FormField>
            </Box>
          )}
          <Box>
            <Text fontWeight="semibold" fontSize="regular" color="static.gray">
              Usage Limit (Optional)
            </Text>
            <FormField
              htmlFor="usage-limit"
              error={errors.totalAllowedUsage?.message as string}
            >
              <Input
                id="usage-limit"
                placeholder="Enter the number of times the promo code can be used"
                {...register('totalAllowedUsage')}
                style={inputStyle}
                onKeyDown={numberValidation}
              />
            </FormField>
          </Box>
          <Box>
            <Text fontWeight="semibold" fontSize="regular" color="static.gray">
              Note (Optional)
            </Text>
            <FormField htmlFor="note" error={errors.note?.message as string}>
              <div style={{ position: 'relative' }}>
                <textarea
                  id="note"
                  placeholder="Example: Discount for new users"
                  {...register('note')}
                  maxLength={300}
                  rows={4}
                  style={{
                    ...inputStyle,
                    width: '100%',
                    resize: 'none',
                    height: '94px',
                    borderRadius: '4px',
                    border: '1px solid #B5BBBC',
                    padding: '10px 16px',
                  }}
                />
                <Text
                  color="static.gray"
                  fontSize="smallText"
                  fontWeight="regular"
                  style={{
                    textAlign: 'right',
                    marginTop: '8px',
                  }}
                >
                  {noteValue.length}/300
                </Text>
              </div>
            </FormField>
          </Box>

          <hr />
          <Box
            cssProps={{
              marginTop: '24px',
            }}
          >
            <Text color="static.gray" fontSize="regular" fontWeight="semibold">
              Applicable payment methods*
            </Text>
            <Stack direction="vertical" gap="10" style={{ marginTop: '10px' }}>
              <Stack direction="horizontal" gap="10">
                {paymentMethodsConfig.map((method) => (
                  <Checkbox
                    key={method.label}
                    id={`payment-${method.label}`}
                    checked={selectedPaymentMethods.some(
                      (selected) =>
                        selected.paymentProvider ===
                          method.value.paymentProvider &&
                        selected.paymentProviderType ===
                          method.value.paymentProviderType
                    )}
                    onChange={(e) => {
                      setPaymentMethodsError(null);
                      if (e.target.checked) {
                        setSelectedPaymentMethods([
                          ...selectedPaymentMethods,
                          method.value,
                        ]);
                      } else {
                        setSelectedPaymentMethods(
                          selectedPaymentMethods.filter(
                            (selected) =>
                              !(
                                selected.paymentProvider ===
                                  method.value.paymentProvider &&
                                selected.paymentProviderType ===
                                  method.value.paymentProviderType
                              )
                          )
                        );
                      }
                    }}
                    label={method.label}
                    labelStyle={{
                      fontSize: '13px',
                    }}
                  />
                ))}
              </Stack>
              {paymentMethodsError && (
                <Text
                  color="static.red"
                  fontSize="smallText"
                  fontWeight="regular"
                >
                  {paymentMethodsError}
                </Text>
              )}
            </Stack>
          </Box>
          <hr />
          {!Boolean(promocode?.parentPromoCodeId) && (
            <Box
              cssProps={{
                marginTop: '16px',
              }}
            >
              <Checkbox
                id="appliedByDefault"
                checked={!disableIsDefaultField() && appliedByDefault}
                label="Applied by default"
                disabled={disableIsDefaultField()}
                onChange={(e) => setAppliedByDefault(e.target.checked)}
                labelStyle={{
                  fontWeight: 'semibold',
                  fontSize: 'regular',
                  color: 'static.gray',
                }}
              />
              <Text
                color="static.gray"
                fontSize="smallText"
                fontWeight="regular"
              >
                Will be applied automatically once the user will be in the
                checkout
              </Text>
            </Box>
          )}

          <Button
            type="submit"
            variant="filled"
            style={{ marginTop: '16px' }}
            disabled={isLoading}
          >
            {isLoading
              ? promocode
                ? 'Updating...'
                : 'Adding...'
              : (promocode ? 'Update' : 'Add') + ' promo code'}
          </Button>
        </Stack>
      </form>
    </CommonModal>
  );
}
