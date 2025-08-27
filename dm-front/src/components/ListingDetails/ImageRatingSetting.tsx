import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { FormField, Input } from '@/components/Form';
import { Stack } from '@/components/Layouts';
import { Loader } from '@/components/Loader';

import { useImageScoreMutation, useListingDetails } from './hooks';

const schema = yup.object().shape({
  imageQualityScore: yup
    .number()
    .typeError('Image quality score should be a number')
    .min(0, 'Image quality score cannot be less than zero')
    .max(10, 'Image quality score cannot be more than ten')
    .required('Image quality score is required'),
});

export function ImageRatingSetting() {
  const { data, isLoading } = useListingDetails();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ imageQualityScore: number }>({ resolver: yupResolver(schema) });

  useEffect(() => {
    reset({
      imageQualityScore: data?.imagesQualityScore,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.imagesQualityScore]);

  const imageUpdateMutation = useImageScoreMutation();

  function handleImageScoreUpdate(formValues: { imageQualityScore: number }) {
    imageUpdateMutation.mutate({
      imagesQualityScore: formValues.imageQualityScore,
      isUpranked: data?.isUpranked!,
      listingId: data?.productId!,
    });
  }
  return (
    <Stack
      as="form"
      id="image-rating-setting"
      direction="vertical"
      gap="2"
      onSubmit={handleSubmit(handleImageScoreUpdate)}
    >
      <Box cssProps={{ maxWidth: 250 }}>
        <FormField
          label="Image Rating (out of 10)"
          htmlFor="image-quality-score"
          error={errors.imageQualityScore?.message}
        >
          {isLoading ? (
            <Loader size="12px" border="static.blue" />
          ) : (
            <Input
              id="image-quality-score"
              autoComplete="off"
              {...register('imageQualityScore')}
            />
          )}
        </FormField>
        <Button
          type="submit"
          variant="filled"
          disabled={imageUpdateMutation.isLoading}
        >
          {imageUpdateMutation.isLoading && (
            <Loader size="12px" border="static.blue" />
          )}{' '}
          Update
        </Button>
      </Box>
    </Stack>
  );
}
