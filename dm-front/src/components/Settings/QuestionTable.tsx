import { Stack } from '../Layouts';
import { EditIcon } from './EditIcon';
import {
  OverflowWrapper,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
  Table,
} from '../Shared/TableComponents';
import styled from 'styled-components';
import css from '@styled-system/css';

import { Box } from '../Box';
import { Text } from '../Text';
import { DeleteIcon } from '../Shared/DeleteIcon';
import { ListIcon } from '../Shared/ListIcon';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { IQuestion, Setting } from '@/models/Setting';
import { Button } from '../Button';
import DeleteQuestionModal from './action/DeleteQuestionModal';
import { useState } from 'react';
import EditQuestionModal from './EditQuestionModal';
import { Input } from '../Form';
import { useForm } from 'react-hook-form';
import { InputProps } from '../Form/Input';
import { CheckIcon } from '../Shared/CheckIcon';
import { useMutation } from '@tanstack/react-query';
import { toast } from '../Toast';
import { useRouter } from 'next/router';
import { ActualImage } from '../Frontliners/ActualImage';

interface FormFieldProps extends InputProps {
  htmlFor: string;
  label?: string;
  error?: string;
}

const FormField = (props: FormFieldProps): React.ReactElement => {
  return (
    <Stack direction="vertical" gap="4">
      {props.children}
    </Stack>
  );
};

export const DeleteQuestionActionLink = styled.span(() =>
  css({
    color: 'static.grays.10',
    cursor: 'pointer',
    '&:hover': {
      color: 'static.red',
    },
  })
);

export const EditQuestionActionLink = styled.span(() =>
  css({
    color: 'static.grays.10',
    cursor: 'pointer',
    '&:hover': {
      color: 'static.blue',
    },
  })
);

export const CheckQuestionActionLink = styled.span(() =>
  css({
    color: 'static.grays.10',
    cursor: 'pointer',
    '&:hover': {
      color: 'static.green',
    },
  })
);

const columnHelper = createColumnHelper<Setting>();

const EditableScoreCell = ({
  value: initialValue,
  data,
  optionType,
  refresh,
}: {
  value: string | number;
  data: IQuestion;
  optionType: string;
  refresh: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      score: initialValue,
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const { mutate: editQuestionSettings } = useMutation(
    Setting.editQuestionSettings,
    {
      onSuccess() {
        toast.success(toast.getMessage('onEditQuestionSuccess'));
        refresh();
      },
      onError() {
        toast.error(toast.getMessage('onEditQuestionError'));
      },
    }
  );

  const onSubmit = async (formValues: any) => {
    const updatedOptions = data.options.map((option) => {
      if (option.nameEn === optionType) {
        return {
          ...option,
          score:
            optionType === 'Yes'
              ? formValues.score || option.score
              : formValues.score || option.score,
        };
      }
      return option;
    });
    const questionData = {
      questionEn: data.questionEn,
      questionAr: data.questionAr,
      // questionnaireId: '671de29af2f0f12b8d77968c',
      questionType: data.questionType,
      options: updatedOptions,
    };

    editQuestionSettings({
      questionId: data.questionId,
      formValues: questionData,
    });
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Stack justify="center" align="center" gap="10">
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <FormField htmlFor="score">
              <Box cssProps={{ position: 'relative' }}>
                <Input
                  {...register('score', {
                    required: true,
                    max: {
                      value: 0,
                      message: 'Score must be less than 0',
                    },
                  })}
                  id="score"
                  placeholder="Score"
                  type="number"
                  autoFocus
                />
                {errors.score && (
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.red"
                  >
                    {errors.score.message}
                  </Text>
                )}
              </Box>
            </FormField>
            <Button type="submit" variant="outline" fontWeight="semibold">
              <CheckQuestionActionLink>
                <CheckIcon />
              </CheckQuestionActionLink>
            </Button>
          </Stack>
        </form>
      ) : (
        <>
          <Text
            fontWeight="regular"
            fontSize="baseText"
            color="static.grays.500"
            style={{ width: '50px', textAlign: 'right' }}
          >
            {typeof initialValue === 'string' ||
            typeof initialValue === 'number'
              ? initialValue
              : ''}
          </Text>
          <EditQuestionActionLink onClick={handleEditClick}>
            <EditIcon />
          </EditQuestionActionLink>
        </>
      )}
    </Stack>
  );
};

const columnOption = [
  columnHelper.display({
    id: 'custom-column',
    cell: (info) => {
      const answerEn = info.row.original.nameEn;
      const answerAr = info.row.original.nameAr;

      return (
        <>
          <Stack direction="horizontal" gap="5">
            <Text
              fontWeight="regular"
              fontSize="baseText"
              color="static.grays.500"
            >
              {info.row.index + 1}.
            </Text>
            <Box>
              <Text
                fontWeight="regular"
                fontSize="baseText"
                color="static.grays.500"
              >
                {answerEn}
              </Text>
              <Text
                fontWeight="regular"
                fontSize="baseText"
                color="static.grays.500"
              >
                {answerAr}
              </Text>
            </Box>
          </Stack>
        </>
      );
    },
    header: (info: any) => {
      const index = info.index;
      const page = info.page;
      // const indexQuestion = info.indexQuestion;
      return (
        <Text fontWeight="regular" fontSize="baseText" color="static.black">
          Q{((page ? Number(page) : 1) - 1) * 10 + index + 1}. Answer
        </Text>
      );
    },
  }),

  columnHelper.accessor('score', {
    cell: (info: any) => {
      const scoreValue = info.getValue();
      const answerEn = info.row.original.nameEn;
      const rowData = info.data;
      const refresh = info.refetchQuestions;

      return (
        <EditableScoreCell
          value={scoreValue}
          data={rowData}
          optionType={answerEn}
          refresh={refresh}
        />
      );
    },
    header: () => (
      <Text fontWeight="regular" fontSize="baseText" color="static.black">
        Score
      </Text>
    ),
  }),
];

const columnImageOption = [
  columnHelper.display({
    id: 'custom-column',
    cell: (info) => {
      const answerEn = info.row.original.nameEn;
      const answerAr = info.row.original.nameAr;

      return (
        <>
          <Stack direction="horizontal" gap="5">
            <Text
              fontWeight="regular"
              fontSize="baseText"
              color="static.grays.500"
            >
              {info.row.index + 1}.
            </Text>
            <Box>
              <Text
                fontWeight="regular"
                fontSize="baseText"
                color="static.grays.500"
              >
                {answerEn}
              </Text>
              <Text
                fontWeight="regular"
                fontSize="baseText"
                color="static.grays.500"
              >
                {answerAr}
              </Text>
            </Box>
          </Stack>
        </>
      );
    },
    header: (info: any) => {
      const index = info.index;
      const page = info.page;
      // const indexQuestion = info.indexQuestion;
      return (
        <Text fontWeight="regular" fontSize="baseText" color="static.black">
          Q{((page ? Number(page) : 1) - 1) * 10 + index + 1}. Answer
        </Text>
      );
    },
  }),

  columnHelper.accessor('imageUrl', {
    cell: (info) => <ActualImage imageUrl={info.getValue()} />,
    header: () => (
      <Text fontWeight="regular" fontSize="baseText" color="static.black">
        Image
      </Text>
    ),
  }),
  columnHelper.accessor('score', {
    cell: (info: any) => {
      const scoreValue = info.getValue();
      const answerEn = info.row.original.nameEn;
      const rowData = info.data;
      const refresh = info.refetchQuestions;

      return (
        <EditableScoreCell
          value={scoreValue}
          data={rowData}
          optionType={answerEn}
          refresh={refresh}
        />
      );
    },
    header: () => (
      <Text fontWeight="regular" fontSize="baseText" color="static.black">
        Score
      </Text>
    ),
  }),
];

export function QuestionTable({
  data,
  index,
  refetchQuestions,
}: {
  data: IQuestion;
  index: number;
  refetchQuestions: () => void;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dataTable = data.options;

  const router = useRouter();

  const { query } = router;

  const table = useReactTable({
    data: dataTable as Setting[],
    columns:
      data.questionType === 'multiple-choice-with-photos' ||
      data.questionType === 'single-choice-with-photos'
        ? columnImageOption
        : columnOption,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleToggleModalDelete = () => {
    setIsDeleteModalOpen((isDeleteModalOpen) => !isDeleteModalOpen);
  };

  const handleToggleModalEdit = () => {
    setIsEditModalOpen((isEditModalOpen) => !isEditModalOpen);
  };

  return (
    <OverflowWrapper>
      <Table>
        <THead>
          <tr>
            <THeadCell style={{ textAlign: 'left' }}>
              <Stack align="center" gap="3">
                <ListIcon />
                <Text
                  fontWeight="regular"
                  fontSize="baseText"
                  color="static.black"
                >
                  Q
                  {((query.page ? Number(query.page) : 1) - 1) * 10 + index + 1}
                  .
                </Text>
              </Stack>
            </THeadCell>
            <THeadCell>
              <Text
                fontWeight="regular"
                fontSize="baseText"
                color="static.black"
              >
                Action
              </Text>
            </THeadCell>
          </tr>
        </THead>
        <TBody>
          <tr>
            <TBodyCell>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                    style={{ margin: '10px 0' }}
                  >
                    English question
                  </Text>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                    style={{ margin: '10px 0' }}
                  >
                    Arabic question
                  </Text>
                </Box>
                <Box cssProps={{ width: '700px' }}>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                    style={{ margin: '10px 0' }}
                  >
                    {data.questionEn}
                  </Text>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                    style={{ margin: '10px 0' }}
                  >
                    {data.questionAr}
                  </Text>
                </Box>
              </Stack>
            </TBodyCell>
            <TBodyCell>
              <Stack align="center" justify="center">
                <Button
                  type="submit"
                  variant="outline"
                  fontWeight="semibold"
                  onClick={handleToggleModalEdit}
                >
                  <EditQuestionActionLink>
                    <EditIcon />
                  </EditQuestionActionLink>
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  fontWeight="semibold"
                  onClick={handleToggleModalDelete}
                >
                  <DeleteQuestionActionLink>
                    <DeleteIcon />
                  </DeleteQuestionActionLink>
                </Button>
              </Stack>
            </TBodyCell>
          </tr>
        </TBody>
      </Table>
      {data.questionType !== 'input-text' && (
        <Table>
          <THead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.isPlaceholder) {
                    return (
                      <THeadCell key={header.id} colSpan={header.colSpan} />
                    );
                  }

                  return (
                    <THeadCell
                      textAlign={
                        header.id === 'custom-column' ? 'left' : 'center'
                      }
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {flexRender(header.column.columnDef.header, {
                        ...header.getContext(),
                        index: index,
                        page: Number(query.page),
                        indexQuestion: data.sortIndex,
                      })}
                    </THeadCell>
                  );
                })}
              </tr>
            ))}
          </THead>
          <TBody>
            {table.getRowModel().rows?.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const textAlign = cell.id.includes('custom-column')
                    ? 'left'
                    : 'center';
                  return (
                    <TBodyCell key={cell.id} style={{ textAlign: textAlign }}>
                      {flexRender(cell.column.columnDef.cell, {
                        ...cell.getContext(),
                        data: data,
                        refetchQuestions: refetchQuestions,
                      })}
                    </TBodyCell>
                  );
                })}
              </tr>
            ))}
          </TBody>
        </Table>
      )}

      <DeleteQuestionModal
        isOpen={isDeleteModalOpen}
        questionId={data.questionId}
        onClose={handleToggleModalDelete}
        refetchQuestions={refetchQuestions}
      />
      <EditQuestionModal
        isOpen={isEditModalOpen}
        data={data}
        onClose={handleToggleModalEdit}
        refetchQuestions={refetchQuestions}
      />
    </OverflowWrapper>
  );
}
