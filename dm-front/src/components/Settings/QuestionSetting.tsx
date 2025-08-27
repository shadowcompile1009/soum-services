import React, { useEffect, useState } from 'react';
import { Text } from '../Text';
import { Stack } from '../Layouts';
import { Box } from '../Box';
import { Button } from '../Button';
import { QuestionTable } from './QuestionTable';
import Select, { SingleValue } from 'react-select';
import { styles } from '../Shared/commonSelectStyles';
import { TableContainer } from '../Shared/TableComponents';
import AddQuestionModal from './AddQuestionModal';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Setting } from '@/models/Setting';
import { toast } from '../Toast';
import { TableLoader } from '../TableLoader';
import { AdminPagination } from '../Pagination';
import { useQuestionTable } from './hooks/useQuestionTable';
import { motion } from 'framer-motion';
import isEmpty from 'lodash.isempty';
import { useQuestionPagination } from '../Pagination/hooks/useAdminPagination';
import { useRouter } from 'next/router';
import OrderQuestionModal from './OrderQuestionModal';

interface ICategory {
  category_name: string;
  _id: string;
}

const QuestionSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenOrder, setIsOpenOrder] = useState(false);
  const router = useRouter();
  const { page } = router.query;

  const handleToggleModal = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const handleToggleOrderModal = () => {
    setIsOpenOrder((isOpenOrder) => !isOpenOrder);
  };
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const { data: categorySettingsData } = useQuery(
    [QUERY_KEYS.categorySettings],
    () => Setting.getCategorySettings(),
    {
      onSuccess() {},
      onError(error: any) {
        if (error?.response.status === 403) {
          toast.error(toast.getMessage('onUnauthorizedAccessError'));
        }
      },
    }
  );

  useEffect(() => {
    const defaultCategory = categorySettingsData?.find(
      (category) => category.category_name === 'Mobiles'
    );
    if (defaultCategory) {
      setSelectedCategory({
        category_name: defaultCategory.category_name,
        _id: defaultCategory._id,
      });
    }
  }, [categorySettingsData]);

  const {
    isLoading,
    data: questionSettingsData,
    refetch,
  } = useQuestionTable({
    categoryId: selectedCategory?._id || '60661c60fdc090d1ce2d4914',
    page: page as string,
  });

  const { total, limit: size, offset } = questionSettingsData || {};

  const paginationData = useQuestionPagination({
    totalResult: total ?? 0,
    pageSize: Number(size),
    currentPage: Number(offset),
  });

  const templateOptions = categorySettingsData?.map((category) => ({
    category_name: category.category_name,
    _id: category._id,
  }));

  const onChangeTemplate = (selectedOption: SingleValue<ICategory>) => {
    router.push({
      pathname: '/settings/questions',
      query: { page: 1 },
    });
    setSelectedCategory(selectedOption);
  };

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  if (questionSettingsData === undefined) {
    return (
      <TableContainer>
        <Text color="static.red" fontSize="smallText" fontWeight="regular">
          Something went wrong
        </Text>
      </TableContainer>
    );
  }

  return (
    <>
      <Box cssProps={{ margin: '20px 0' }}>
        <Stack direction="vertical" gap="5">
          <Text fontWeight="headingOne" fontSize="bigText" color="static.black">
            Questions
          </Text>
          <Text
            fontWeight="regular"
            fontSize="baseText"
            color="static.grays.500"
          >
            Select category:
          </Text>
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Select
                isDisabled={false}
                value={selectedCategory}
                // @ts-ignore
                styles={styles}
                onChange={onChangeTemplate}
                placeholder="---"
                isLoading={false}
                options={templateOptions}
                getOptionLabel={(option) => option?.category_name}
                getOptionValue={(option) => option?._id}
                isSearchable={true}
                id="category-template-select"
                instanceId="category-template-select"
              />
            </Box>
            <Stack gap="10">
              {!isEmpty(questionSettingsData?.items[0].questions) && (
                <Button
                  type="button"
                  variant="filled"
                  cssProps={{ marginRight: '20px' }}
                  fontWeight="semibold"
                  onClick={handleToggleOrderModal}
                >
                  Reorder Questions
                </Button>
              )}
              <Button
                type="button"
                variant="filled"
                cssProps={{ marginRight: '20px' }}
                fontWeight="semibold"
                onClick={handleToggleModal}
              >
                ADD
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {isEmpty(questionSettingsData?.items[0].questions) && (
        <TableContainer>
          <Text color="static.gray" fontSize="smallText" fontWeight="regular">
            No questions
          </Text>
        </TableContainer>
      )}
      {questionSettingsData.items[0]?.questions.map((question, index) => {
        return (
          <>
            <TableContainer
              as={motion.div}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              key={question._id}
            >
              <QuestionTable
                refetchQuestions={refetch}
                data={question}
                index={index}
              />
            </TableContainer>
          </>
        );
      })}
      <AdminPagination {...paginationData} />

      <AddQuestionModal
        isOpen={isOpen}
        setOpen={handleToggleModal}
        refetchQuestions={refetch}
        questionnaireId={questionSettingsData?.items[0]._id}
      />
      <OrderQuestionModal
        isOpen={isOpenOrder}
        setOpen={handleToggleOrderModal}
        category={selectedCategory?._id || '60661c60fdc090d1ce2d4914'}
        refetch={refetch}
      />
    </>
  );
};

export default QuestionSettings;
