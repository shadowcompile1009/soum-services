import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import type { Grade } from '@/models/ProductListing';

import { ProductGrade } from './ProductGrade';

function checkGrade(grade: Grade) {
  switch (true) {
    case grade.includes('Like New'):
      return 'excellent';
    case grade.includes('Lightly Used'):
      return 'great';
    case grade.includes('Fair'):
      return 'good';
    case grade.includes('Extensive Use'):
      return 'extensive';
    default:
      return 'unknown';
  }
}

interface SellerQuestionHeadingProps {
  grade: Grade;
}

export function SellerQuestionHeading(props: SellerQuestionHeadingProps) {
  const { grade } = props;

  return (
    <Stack gap="5" align="center">
      <Text fontSize="baseText" color="static.blue" fontWeight="baseText">
        New Seller Questions List
      </Text>
      <ProductGrade grade={checkGrade(grade)} originalGrade={grade} />
    </Stack>
  );
}
