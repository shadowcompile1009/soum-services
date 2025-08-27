import { Stack } from '@/components/Layouts';
import { Card } from '@/components/Card';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';

import { useListingResponses, useListingDetails } from './hooks';
import { SellerQuestionHeading } from './SellerQuestionHeading';
import { ProductQuestion, IAnswer } from '@/models/ProductQuestion';
import { useReviewResponses } from './hooks/useReviewResponses';

function SellerAnswer(props: { answers: IAnswer[] }) {
  return (
    <Box
      cssProps={{
        paddingY: 4,
        paddingX: 8,
      }}
    >
      <Text fontSize="baseText" color="static.black" fontWeight="baseText">
        Answer: {props.answers.map((answer) => answer.answer).join(', ')}
      </Text>
    </Box>
  );
}

function SellerQuestion(props: { question: ProductQuestion; index: number }) {
  const { question, index } = props;
  return (
    <>
      <Stack direction="vertical" gap="3">
        <Box
          cssProps={{
            backgroundColor: 'static.blues.10',
            paddingY: 4,
            paddingX: 8,
          }}
        >
          <Text
            fontSize="baseText"
            color="static.grays.500"
            fontWeight="baseText"
          >
            Q.{index + 1} {question.question}
          </Text>
        </Box>
        <SellerAnswer answers={question.answers} />
      </Stack>
      <Box as="hr" cssProps={{ borderColor: 'static.grays.500', margin: 0 }} />
    </>
  );
}

export function SellerQuestions() {
  const { data, isLoading } = useListingResponses();
  const { data: dataReview, isLoading: isLoadingReview } = useReviewResponses();
  const { data: listingDetails, isLoading: isListingDetailsLoading } =
    useListingDetails();

  if (isLoading || isListingDetailsLoading || isLoadingReview) return null;

  return (
    <Box cssProps={{ flex: 1 }}>
      <Card heading={<SellerQuestionHeading grade={listingDetails!.grade} />}>
        <Stack direction="vertical" gap="5">
          {data?.map((question, index) => (
            <SellerQuestion
              index={index}
              key={question.questionId}
              question={question}
            />
          ))}
          {dataReview?.map((question: any, index: number) => (
            <SellerQuestion
              index={index}
              key={question.questionId}
              question={question}
            />
          ))}
        </Stack>
      </Card>
    </Box>
  );
}
