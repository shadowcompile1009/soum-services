import styled from 'styled-components';
import css from '@styled-system/css';
import { Box } from '../Box';
import { Button } from '../Button';
import { Label } from '../Form';
import { Stack } from '../Layouts';
import { CommonModal } from '../Modal';
import { CloseIcon } from '../Shared/CloseIcon';
import { IconContainer } from '../Shared/IconContainer';
import { Text } from '../Text';
import Select, { SingleValue } from 'react-select';
import { InputProps } from '../Form/Input';
import { useEffect, useRef, useState } from 'react';
import { colors } from '@/tokens/colors';
import { UploadIcon } from '../Shared/UploadIcon';
import { useMutation } from '@tanstack/react-query';
import { Setting } from '@/models/Setting';
import { toast } from '../Toast';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ImageUploadModal } from '../Shared/ImageUploadModal';
import { ActualImage } from '../Frontliners/ActualImage';
import { Switch } from '../Switch';

interface FormFieldProps extends InputProps {
  htmlFor: string;
  label?: string;
  error?: string;
}

export function FormField(props: FormFieldProps): React.ReactElement {
  const { label, htmlFor, error } = props;

  return (
    <Stack direction="vertical" gap="4">
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {props.children}
      {error ? (
        <Text
          fontSize="smallText"
          fontWeight="smallText"
          color="static.red"
          as="span"
        >
          {' '}
          {error}
        </Text>
      ) : (
        <Box></Box>
      )}
    </Stack>
  );
}

const placeholderStyles = {
  color: 'static.gray',
  fontSize: 2,
};

const Input = styled(Box).attrs((p) => ({
  as: (p as unknown as { as: string }).as || 'input',
}))<InputProps>(() => {
  const padding = {
    pt: 5,
    pr: 8,
    pb: 5,
    pl: 8,
  };

  return css({
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    height: 20,
    width: '100%',
    fontSize: 1,
    ...padding,
    borderRadius: 4,
    backgroundColor: 'static.white',
    border: '1px solid',
    borderColor: '#ccc',
    color: 'static.black',
    '::-webkit-input-placeholder': placeholderStyles,
    '::-ms-input-placeholder': placeholderStyles,
    '::placeholder': placeholderStyles,
    transition: 'all ease',
    transitionDuration: '200ms',
    appearance: 'none',

    ':hover': {
      border: '1px solid',
      borderColor: 'hover.gray',
      outline: 'none !important',
    },
    ':active, :focus': {
      border: '1px solid',
      borderColor: 'static.gray',
      outline: 'none !important',
    },
    ':disabled': {
      opacity: 1,
      borderColor: 'static.grays.50',
      backgroundColor: 'static.grays.50',
      color: 'static.gray',
    },
  });
});

export const styles = {
  container: (provided: Record<string, unknown>) => ({
    ...provided,
    minWidth: '300px',
    textAlign: 'left',
    '@media (max-width: 500px)': {
      minWidth: '100%',
    },
  }),
  control: (provided: Record<string, unknown>) => ({
    ...provided,
    '&:hover': {
      borderColor: colors.static.black,
    },
  }),
};

const FileUploadWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 0px 10px;
  border-radius: 5px;
  width: 300px;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;

const FileUploadName = styled.span`
  flex-grow: 1;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileUploadIcon = styled.label`
  cursor: pointer;
  color: #007bff;
  font-size: 20px;

  &:hover {
    color: #0056b3;
  }
`;

export interface IOption {
  value: string;
  label: string;
}

export const templateOptions: IOption[] = [
  { value: 'yes-no', label: 'Yes/No' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'input-text', label: 'Input Text' },
  { value: 'single-choice-with-photos', label: 'Single Choice With Photos' },
  {
    value: 'multiple-choice-with-photos',
    label: 'Multiple Choice With Photos',
  },
];

export const templateLevels: IOption[] = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'very-good', label: 'Very Good' },
  { value: 'good', label: 'Good' },
  { value: 'acceptable', label: 'Acceptable' },
  { value: 'poor', label: 'Poor' },
];

interface Props {
  isOpen: boolean;
  setOpen: () => void;
  refetchQuestions: () => void;
  questionnaireId: string;
}

const AddQuestionModal = ({
  isOpen,
  setOpen,
  refetchQuestions,
  questionnaireId,
}: Props) => {
  const [selectedTypeQuestion, setTypeQuestion] = useState<IOption | undefined>(
    templateOptions.find((option) => option.value === 'yes-no')
  );

  const [isSavePressed, setIsSavePressed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleChange = (option: SingleValue<IOption>) => {
    setTypeQuestion(option ?? undefined);
    reset();
    setIsSavePressed(false);
  };

  const { mutate: addNewQuestionSettings } = useMutation(
    Setting.addNewQuestionSettings,
    {
      onSuccess() {
        toast.success(toast.getMessage('onAddNewQuestionSuccess'));
        setOpen();
        reset();
        refetchQuestions();
        setIsSavePressed(false);
      },
      onError() {
        toast.error(toast.getMessage('onAddNewQuestionError'));
        reset();
        setIsSavePressed(false);
      },
    }
  );

  const onSubmit = async (formValues: any) => {
    if (!selectedTypeQuestion) {
      return;
    }

    if (
      selectedTypeQuestion.value === 'single-choice-with-photos' ||
      selectedTypeQuestion.value === 'multiple-choice-with-photos'
    ) {
      const hasAllImages = formValues.options.every((option: any) => {
        return (
          (selectedTypeQuestion.value !== 'single-choice-with-photos' &&
            selectedTypeQuestion.value !== 'multiple-choice-with-photos') ||
          option.image
        );
      });

      if (!hasAllImages) {
        return;
      }
    }

    const questionData = {
      questionEn:
        selectedTypeQuestion?.value !== 'input-text'
          ? formValues.question_en
          : formValues.text_en,
      questionAr:
        selectedTypeQuestion?.value !== 'input-text'
          ? formValues.question_ar
          : formValues.text_ar,
      questionType: selectedTypeQuestion?.value || '',
      questionnaireId: questionnaireId,
      isMandatory:
        selectedTypeQuestion?.value === 'input-text'
          ? formValues.status
          : false,
      placeholderTextEn:
        selectedTypeQuestion?.value === 'input-text'
          ? formValues.placeholder_en
          : '',
      placeholderTextAr:
        selectedTypeQuestion?.value === 'input-text'
          ? formValues.placeholder_ar
          : '',
      subTextEn:
        selectedTypeQuestion?.value === 'input-text' ? formValues.sub_en : '',
      subTextAr:
        selectedTypeQuestion?.value === 'input-text' ? formValues.sub_ar : '',
      options:
        selectedTypeQuestion?.value === 'yes-no'
          ? [
              {
                nameEn: 'Yes',
                nameAr: 'نعم',
                score: formValues.yes_score || 0,
              },
              {
                nameEn: 'No',
                nameAr: 'لا',
                score: formValues.no_score || 0,
              },
            ]
          : selectedTypeQuestion?.value === 'input-text'
          ? []
          : selectedTypeQuestion?.value === 'multiple-choice'
          ? formValues.options?.map((option: any) => ({
              nameEn: option.ansEnglish,
              nameAr: option.ansArabic,
              score: option.score || 0,
            }))
          : selectedTypeQuestion?.value === 'multiple-choice-with-photos'
          ? formValues.options?.map((option: any) => ({
              nameEn: option.ansEnglish,
              nameAr: option.ansArabic,
              score: option.score || 0,
              imageUrl: option.image,
            }))
          : formValues.options?.map((option: any) => ({
              nameEn: option.ansEnglish,
              nameAr: option.ansArabic,
              score: option.score || 0,
              imageUrl: option.image,
              level: option.typeLevel ? option.typeLevel : 'good',
            })),
    };
    addNewQuestionSettings({
      formValues: questionData,
    });
  };

  const handleClose = () => {
    reset();
    setOpen();
    setIsSavePressed(false);
  };

  return (
    <CommonModal onClose={handleClose} isOpen={isOpen} width={570}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Box
            cssProps={{
              borderBottom: '1px solid #ccc',
              paddingBottom: '5px',
              marginBottom: '15px',
            }}
          >
            <Stack justify="space-between" align="center">
              <Text
                fontWeight="regular"
                fontSize="bigSubtitle"
                color="static.black"
              >
                Add question
              </Text>
              <IconContainer
                color="static.black"
                role="button"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconContainer>
            </Stack>
          </Box>
          <Stack justify="flex-end">
            <Select
              isDisabled={false}
              value={selectedTypeQuestion}
              // @ts-ignore
              styles={styles}
              onChange={handleChange}
              placeholder={selectedTypeQuestion?.label}
              isLoading={false}
              options={templateOptions}
              getOptionLabel={(option) => option?.label}
              getOptionValue={(option) => option?.value}
              isSearchable={false}
              id="category-template-select"
              instanceId="category-template-select"
            />
          </Stack>
          {selectedTypeQuestion?.value === 'input-text' ? (
            <TextQuestion
              setValue={setValue}
              register={register}
              errors={errors}
            />
          ) : (
            <Box padding={5}>
              <Text
                fontWeight="regular"
                fontSize="baseText"
                color="static.black"
              >
                Question
              </Text>
              <Box marginTop={2}>
                <FormField htmlFor="english-input">
                  <Box cssProps={{ position: 'relative' }}>
                    <Input
                      {...register('question_en', { required: true })}
                      style={{ paddingRight: '44px' }}
                      id="english-input"
                      placeholder="English Question"
                    />
                    {isSavePressed && errors.question_en && (
                      <Text
                        fontWeight="regular"
                        fontSize="baseText"
                        color="static.red"
                      >
                        Required
                      </Text>
                    )}
                  </Box>
                </FormField>
                <FormField htmlFor="arabic-input">
                  <Box cssProps={{ position: 'relative' }}>
                    <Input
                      {...register('question_ar', { required: true })}
                      style={{ paddingRight: '44px' }}
                      id="arabic-input"
                      placeholder="Arabic Question"
                    />
                    {isSavePressed && errors.question_ar && (
                      <Text
                        fontWeight="regular"
                        fontSize="baseText"
                        color="static.red"
                      >
                        Required
                      </Text>
                    )}
                  </Box>
                </FormField>
              </Box>
              {selectedTypeQuestion?.value === 'yes-no' ? (
                <YesNoQuestion register={register} errors={errors} />
              ) : selectedTypeQuestion?.value === 'multiple-choice' ? (
                <MultipleChoiceQuestion register={register} errors={errors} />
              ) : selectedTypeQuestion?.value === 'dropdown' ? (
                <DropdownQuestion register={register} errors={errors} />
              ) : selectedTypeQuestion?.value ===
                'single-choice-with-photos' ? (
                <SingleChoiceWithPhotos
                  isSavePressed={isSavePressed}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                />
              ) : (
                <MultipleChoiceWithPhotos
                  isSavePressed={isSavePressed}
                  register={register}
                  errors={errors}
                />
              )}
            </Box>
          )}
          <Button
            type="submit"
            variant="filled"
            cssProps={{ width: '100%', height: '40px' }}
            fontWeight="semibold"
            onClick={() => setIsSavePressed(true)}
          >
            Save
          </Button>
        </Box>
      </form>
    </CommonModal>
  );
};

const TextQuestion = ({
  register,
  errors,
  setValue,
}: {
  register: any;
  errors: any;
  setValue: any;
}) => {
  const [isMandatory, setIsMandatory] = useState(true);
  setValue('status', isMandatory);
  const toggleClickHandler = () => {
    setIsMandatory((prev) => {
      const newMandatory = !prev;
      return newMandatory;
    });
  };
  return (
    <>
      <Box>
        <Text fontWeight="regular" fontSize="baseText" color="static.black">
          Text input title
        </Text>
        <Box marginTop={2}>
          <FormField htmlFor="text-english-input">
            <Box cssProps={{ position: 'relative' }}>
              <Input
                {...register('text_en', { required: true })}
                style={{ paddingRight: '44px' }}
                id="text-english-input"
                placeholder="Enter English"
              />
              {errors.text_en && (
                <Text
                  fontWeight="regular"
                  fontSize="baseText"
                  color="static.red"
                >
                  Required
                </Text>
              )}
            </Box>
          </FormField>
          <FormField htmlFor="text-arabic-input">
            <Box cssProps={{ position: 'relative' }}>
              <Input
                {...register('text_ar', { required: true })}
                style={{ paddingRight: '44px' }}
                id="text-arabic-input"
                placeholder="Enter Arabic"
              />
              {errors.text_ar && (
                <Text
                  fontWeight="regular"
                  fontSize="baseText"
                  color="static.red"
                >
                  Required
                </Text>
              )}
            </Box>
          </FormField>
        </Box>
      </Box>
      <Box>
        <Text fontWeight="regular" fontSize="baseText" color="static.black">
          Placeholder text
        </Text>
        <Box marginTop={2}>
          <FormField htmlFor="placeholder-english-input">
            <Box cssProps={{ position: 'relative' }}>
              <Input
                {...register('placeholder_en', { required: true })}
                style={{ paddingRight: '44px' }}
                id="placeholder-english-input"
                placeholder="Enter English"
              />
              {errors.placeholder_en && (
                <Text
                  fontWeight="regular"
                  fontSize="baseText"
                  color="static.red"
                >
                  Required
                </Text>
              )}
            </Box>
          </FormField>
          <FormField htmlFor="placeholder-arabic-input">
            <Box cssProps={{ position: 'relative' }}>
              <Input
                {...register('placeholder_ar', { required: true })}
                style={{ paddingRight: '44px' }}
                id="placeholder-arabic-input"
                placeholder="Enter Arabic"
              />
              {errors.placeholder_ar && (
                <Text
                  fontWeight="regular"
                  fontSize="baseText"
                  color="static.red"
                >
                  Required
                </Text>
              )}
            </Box>
          </FormField>
        </Box>
      </Box>
      <Box>
        <Text fontWeight="regular" fontSize="baseText" color="static.black">
          Subtext
        </Text>
        <Box marginTop={2}>
          <FormField htmlFor="sub-english-input">
            <Box cssProps={{ position: 'relative' }}>
              <Input
                {...register('sub_en', { required: true })}
                style={{ paddingRight: '44px' }}
                id="sub-english-input"
                placeholder="Enter English"
              />
              {errors.sub_en && (
                <Text
                  fontWeight="regular"
                  fontSize="baseText"
                  color="static.red"
                >
                  Required
                </Text>
              )}
            </Box>
          </FormField>
          <FormField htmlFor="sub-arabic-input">
            <Box cssProps={{ position: 'relative' }}>
              <Input
                {...register('sub_ar', { required: true })}
                style={{ paddingRight: '44px' }}
                id="sub-arabic-input"
                placeholder="Enter Arabic"
              />
              {errors.sub_ar && (
                <Text
                  fontWeight="regular"
                  fontSize="baseText"
                  color="static.red"
                >
                  Required
                </Text>
              )}
            </Box>
          </FormField>
        </Box>
      </Box>
      <Box marginBottom={5}>
        <Text
          style={{ marginBottom: '10px' }}
          fontWeight="regular"
          fontSize="baseText"
          color="static.black"
        >
          Is this question mandatory?
        </Text>
        <Switch defaultOn={isMandatory} onClick={toggleClickHandler} />
      </Box>
    </>
  );
};

const YesNoQuestion = ({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) => {
  return (
    <>
      <Box marginBottom={15}>
        <Stack justify="space-between">
          <Box cssProps={{ width: '130px' }}>
            <Box
              cssProps={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginBottom: '1px',
              }}
            >
              <Text
                fontWeight="regular"
                fontSize="baseText"
                color="static.grays.500"
                style={{ textAlign: 'center' }}
              >
                No
              </Text>
            </Box>
            <Box
              cssProps={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginBottom: '10px',
              }}
            >
              <Text
                fontWeight="regular"
                fontSize="baseText"
                color="static.grays.500"
                style={{ textAlign: 'center' }}
              >
                لا
              </Text>
            </Box>
            <FormField htmlFor="no-input">
              <Box cssProps={{ position: 'relative' }}>
                <Input
                  {...register('no_score', {
                    required: { value: true, message: 'Required' },
                    max: {
                      value: 0,
                      message: 'Score must be less than 0',
                    },
                  })}
                  id="no-input"
                  placeholder="Score"
                  type="number"
                />
                {errors.no_score && (
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.red"
                  >
                    {errors.no_score.message}
                  </Text>
                )}
              </Box>
            </FormField>
          </Box>
          <Box cssProps={{ width: '130px' }}>
            <Box
              cssProps={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginBottom: '1px',
              }}
            >
              <Text
                fontWeight="regular"
                fontSize="baseText"
                color="static.grays.500"
                style={{ textAlign: 'center' }}
              >
                Yes
              </Text>
            </Box>
            <Box
              cssProps={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginBottom: '10px',
              }}
            >
              <Text
                fontWeight="regular"
                fontSize="baseText"
                color="static.grays.500"
                style={{ textAlign: 'center' }}
              >
                نعم
              </Text>
            </Box>
            <FormField htmlFor="yes-input">
              <Box cssProps={{ position: 'relative' }}>
                <Input
                  {...register('yes_score', {
                    required: { value: true, message: 'Required' },
                    max: {
                      value: 0,
                      message: 'Score must be less than 0',
                    },
                  })}
                  id="yes-input"
                  placeholder="Score"
                  type="number"
                />
                {errors.yes_score && (
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.red"
                  >
                    {errors.yes_score.message}
                  </Text>
                )}
              </Box>
            </FormField>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

const MultipleChoiceQuestion = ({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) => {
  const [options, setOptions] = useState([
    { ansEnglish: '', ansArabic: '', score: '', image: '' },
    { ansEnglish: '', ansArabic: '', score: '', image: '' },
  ]);

  const handleAddOption = () => {
    setOptions([
      ...options,
      { ansEnglish: '', ansArabic: '', score: '', image: '' },
    ]);
  };

  return (
    <>
      {options.map((_, index) => {
        return (
          <Box key={index}>
            <Text fontWeight="regular" fontSize="baseText" color="static.black">
              Option {index + 1}
            </Text>
            <Box marginTop={2}>
              <FormField htmlFor={`english-input-${index}`}>
                <Box cssProps={{ position: 'relative' }}>
                  <Input
                    {...register(`options[${index}].ansEnglish`, {
                      required: true,
                    })}
                    style={{ paddingRight: '44px' }}
                    id={`english-input-${index}`}
                    placeholder="English option"
                  />
                  {errors.options?.[index]?.ansEnglish && (
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.red"
                    >
                      Required
                    </Text>
                  )}
                </Box>
              </FormField>
              <FormField htmlFor="arabic-input">
                <Box cssProps={{ position: 'relative' }}>
                  <Input
                    {...register(`options[${index}].ansArabic`, {
                      required: true,
                    })}
                    style={{ paddingRight: '44px' }}
                    id={`arabic-input-${index}`}
                    placeholder="Arabic option"
                  />
                  {errors.options?.[index]?.ansArabic && (
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.red"
                    >
                      Required
                    </Text>
                  )}
                </Box>
              </FormField>

              <Box cssProps={{ display: 'flex', justifyContent: 'flex-end' }}>
                <FormField htmlFor={`score-input-${index}`}>
                  <Box
                    cssProps={{
                      position: 'relative',
                      width: '130px',
                    }}
                  >
                    <Input
                      {...register(`options[${index}].score`, {
                        required: { value: true, message: 'Required' },
                        max: {
                          value: 0,
                          message: 'Score must be less than 0',
                        },
                      })}
                      id={`score-input-${index}`}
                      placeholder="Score"
                      type="number"
                    />
                    {errors.options?.[index]?.score && (
                      <Text
                        fontWeight="regular"
                        fontSize="baseText"
                        color="static.red"
                      >
                        {errors.options?.[index]?.score.message}
                      </Text>
                    )}
                  </Box>
                </FormField>
              </Box>
            </Box>
          </Box>
        );
      })}
      <Button
        type="button"
        variant="outline"
        cssProps={{ padding: '16px 10px 16px 0' }}
        onClick={handleAddOption}
      >
        + Add more options
      </Button>
    </>
  );
};

const DropdownQuestion = ({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) => {
  const [options, setOptions] = useState([
    { ansEnglish: '', ansArabic: '', score: '' },
    { ansEnglish: '', ansArabic: '', score: '' },
  ]);

  const handleAddOption = () => {
    setOptions([...options, { ansEnglish: '', ansArabic: '', score: '' }]);
  };

  return (
    <>
      {options.map((_, index) => {
        return (
          <Box key={index}>
            <Text fontWeight="regular" fontSize="baseText" color="static.black">
              Option {index + 1}
            </Text>
            <Box marginTop={2}>
              <FormField htmlFor={`english-input-${index}`}>
                <Box cssProps={{ position: 'relative' }}>
                  <Input
                    {...register(`options[${index}].ansEnglish`, {
                      required: true,
                    })}
                    style={{ paddingRight: '44px' }}
                    id={`english-input-${index}`}
                    placeholder="English option"
                  />
                  {errors.options?.[index]?.ansEnglish && (
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.red"
                    >
                      Required
                    </Text>
                  )}
                </Box>
              </FormField>
              <FormField htmlFor="arabic-input">
                <Box cssProps={{ position: 'relative' }}>
                  <Input
                    {...register(`options[${index}].ansArabic`, {
                      required: true,
                    })}
                    style={{ paddingRight: '44px' }}
                    id={`arabic-input-${index}`}
                    placeholder="Arabic option"
                  />
                  {errors.options?.[index]?.ansArabic && (
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.red"
                    >
                      Required
                    </Text>
                  )}
                </Box>
              </FormField>

              <Box cssProps={{ display: 'flex', justifyContent: 'flex-end' }}>
                <FormField htmlFor={`score-input-${index}`}>
                  <Box
                    cssProps={{
                      position: 'relative',
                      width: '130px',
                    }}
                  >
                    <Input
                      {...register(`options[${index}].score`, {
                        required: { value: true, message: 'Required' },
                        max: {
                          value: 0,
                          message: 'Score must be less than 0',
                        },
                      })}
                      id={`score-input-${index}`}
                      placeholder="Score"
                      type="number"
                    />
                    {errors.options?.[index]?.score && (
                      <Text
                        fontWeight="regular"
                        fontSize="baseText"
                        color="static.red"
                      >
                        {errors.options?.[index]?.score.message}
                      </Text>
                    )}
                  </Box>
                </FormField>
              </Box>
            </Box>
          </Box>
        );
      })}
      <Button
        type="button"
        variant="outline"
        cssProps={{ padding: '16px 10px 16px 0' }}
        onClick={handleAddOption}
      >
        + Add more options
      </Button>
    </>
  );
};

export interface IImages {
  name?: string;
  status?: boolean;
  url?: string;
  imageUrl?: string;
}

const SingleChoiceWithPhotos = ({
  register,
  errors,
  isSavePressed,
  setValue,
}: {
  register: any;
  errors: any;
  isSavePressed: boolean;
  setValue: any;
}) => {
  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [fileNames, setFileNames] = useState<string[]>(['', '']);
  const [maxImg, setMaxImg] = useState<number>(1);
  const [currentOptionIndex, setCurrentOptionIndex] = useState<number | null>(
    null
  );
  const [showImageModal, setShowImageModals] = useState<boolean>(false);
  const [options, setOptions] = useState([
    {
      ansEnglish: '',
      ansArabic: '',
      score: '',
      image: '',
      level: 'good',
    },
    {
      ansEnglish: '',
      ansArabic: '',
      score: '',
      image: '',
      level: 'good',
    },
  ]);
  const [selectedTypeLevels, setTypeLevels] = useState<
    Array<IOption | undefined>
  >(
    options.map(() => templateLevels.find((option) => option.value === 'good'))
  );

  useEffect(() => {
    options.forEach((option, index) => {
      setValue(`options.${index}.typeLevel`, 'good');
      if (!option.level) {
        setValue(`options.${index}.typeLevel`, 'good');
      }
    });
  }, [setValue]);

  const handleChangeLevel = (option: SingleValue<IOption>, index: number) => {
    const updatedTypeLevels = [...selectedTypeLevels];
    updatedTypeLevels[index] = option ?? undefined;
    setTypeLevels(updatedTypeLevels);

    setValue(`options.${index}.typeLevel`, option?.value || '', {
      shouldValidate: true,
    });
  };

  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        ansEnglish: '',
        ansArabic: '',
        score: '',
        image: '',
        level: '',
      },
    ]);
    setFileNames([...fileNames, '']);
    fileInputRefs.current.push(null);

    setTypeLevels([
      ...selectedTypeLevels,
      templateLevels.find((option) => option.value === 'good'),
    ]);
  };

  async function uploadImage(imageObject: any, presignedUrl: string) {
    try {
      const response = await axios.put(presignedUrl, imageObject, {
        headers: {
          'Content-Type': imageObject.type,
        },
      });

      if (response.status === 200) {
        console.log(`File ${imageObject.name} uploaded successfully!`);
      } else {
        console.error(
          `Failed to upload file ${imageObject.name}:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error uploading file ${imageObject.name}:`, error);
    }
  }

  async function handleImageSave(files: any) {
    const presignedURLs = await Setting.getPresignedURL({
      count: files?.length,
      fileExtension: 'png',
    });

    const urlsToUpdate = presignedURLs?.data?.map(
      (urlObject: any) => urlObject?.url
    );

    await Promise.all(
      files?.map((imageFile: any, index: number) =>
        uploadImage(imageFile, urlsToUpdate[index])
      )
    );

    if (currentOptionIndex !== null) {
      const images: IImages[] = (presignedURLs?.data || []).map(
        (presignURL: any, index: number) => ({
          name: files[index]?.name,
          status: Boolean(presignURL?.cdn && presignURL?.path),
          url:
            presignURL?.cdn && presignURL?.path
              ? `${presignURL.cdn}/${presignURL.path}`
              : undefined,
          imageUrl: presignURL?.path,
        })
      );
      const updatedFileNames = [...fileNames];
      updatedFileNames[currentOptionIndex] = images[0]?.name || '';
      setFileNames(updatedFileNames);

      const updatedOptions = [...options];
      updatedOptions[currentOptionIndex] = {
        ...updatedOptions[currentOptionIndex],
        image: images[0]?.url || '',
      };
      setOptions(updatedOptions);

      register(`options.${currentOptionIndex}.image`, {
        value: images[0]?.url || '',
      });
    }

    setShowImageModals(false);
    setCurrentOptionIndex(null);
  }

  return (
    <>
      {options.map((option, index) => {
        return (
          <Box key={index}>
            <Text fontWeight="regular" fontSize="baseText" color="static.black">
              Option {index + 1}
            </Text>
            <Box marginTop={2}>
              <FormField htmlFor={`english-input-${index}`}>
                <Box cssProps={{ position: 'relative' }}>
                  <Input
                    {...register(`options[${index}].ansEnglish`, {
                      required: true,
                    })}
                    style={{ paddingRight: '44px' }}
                    id={`english-input-${index}`}
                    placeholder="English option"
                  />
                  {isSavePressed && errors.options?.[index]?.ansEnglish && (
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.red"
                    >
                      Required
                    </Text>
                  )}
                </Box>
              </FormField>
              <FormField htmlFor="arabic-input">
                <Box cssProps={{ position: 'relative' }}>
                  <Input
                    {...register(`options[${index}].ansArabic`, {
                      required: true,
                    })}
                    style={{ paddingRight: '44px' }}
                    id={`arabic-input-${index}`}
                    placeholder="Arabic option"
                  />
                  {isSavePressed && errors.options?.[index]?.ansArabic && (
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.red"
                    >
                      Required
                    </Text>
                  )}
                </Box>
              </FormField>
              <Stack justify="space-between" align="center">
                <Text
                  fontWeight="regular"
                  fontSize="baseText"
                  color="static.black"
                >
                  Upload Image
                </Text>
                <FileUploadWrapper
                  onClick={() => {
                    setShowImageModals(true);
                    setCurrentOptionIndex(index);
                  }}
                >
                  <FileUploadName>{fileNames[index]}</FileUploadName>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowImageModals(true);
                      setMaxImg(1);
                    }}
                    disabled={false}
                    style={{ padding: '4px', fontSize: '12px' }}
                  >
                    <FileUploadIcon htmlFor="file-upload">
                      <UploadIcon />
                    </FileUploadIcon>
                  </Button>
                </FileUploadWrapper>
              </Stack>
              <Stack justify="flex-end" style={{ marginBottom: '10px' }}>
                {isSavePressed && !option.image && (
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.red"
                  >
                    Required
                  </Text>
                )}
              </Stack>

              <Box cssProps={{ display: 'flex', justifyContent: 'flex-end' }}>
                <FormField htmlFor={`score-input-${index}`}>
                  <Box
                    cssProps={{
                      position: 'relative',
                      width: '130px',
                    }}
                  >
                    <Input
                      {...register(`options[${index}].score`, {
                        required: {
                          value: true,
                          message: 'Required',
                        },
                        max: {
                          value: 0,
                          message: 'Score must be less than 0',
                        },
                      })}
                      id={`score-input-${index}`}
                      placeholder="Score"
                      type="number"
                    />
                    {isSavePressed && errors.options?.[index]?.score && (
                      <Text
                        fontWeight="regular"
                        fontSize="baseText"
                        color="static.red"
                      >
                        {errors.options?.[index]?.score.message}
                      </Text>
                    )}
                  </Box>
                </FormField>
              </Box>
              <Box marginBottom={10}>
                <Select
                  isDisabled={false}
                  // @ts-ignore
                  styles={styles}
                  onChange={(selectedOption) => {
                    handleChangeLevel(selectedOption, index);
                  }}
                  placeholder={selectedTypeLevels[index]?.label}
                  isLoading={false}
                  options={templateLevels}
                  getOptionLabel={(option) => option?.label}
                  getOptionValue={(option) => option?.value}
                  isSearchable={false}
                  id={`level-template-select-${index}`}
                  instanceId={`level-template-select-${index}`}
                />
              </Box>

              {option.image && (
                <Stack justify="center">
                  <ActualImage imageUrl={option.image} />
                </Stack>
              )}
            </Box>
          </Box>
        );
      })}
      <Button
        type="button"
        variant="outline"
        cssProps={{ padding: '16px 10px 16px 0' }}
        onClick={handleAddOption}
      >
        + Add more options
      </Button>
      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModals(false)}
        onSave={handleImageSave}
        isLoading={false}
        maxFiles={maxImg}
      />
    </>
  );
};

const MultipleChoiceWithPhotos = ({
  register,
  errors,
  isSavePressed,
}: {
  register: any;
  errors: any;
  isSavePressed: boolean;
}) => {
  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [fileNames, setFileNames] = useState<string[]>(['', '']);
  const [maxImg, setMaxImg] = useState<number>(1);
  const [currentOptionIndex, setCurrentOptionIndex] = useState<number | null>(
    null
  );

  const [showImageModal, setShowImageModals] = useState<boolean>(false);
  const [options, setOptions] = useState([
    { ansEnglish: '', ansArabic: '', score: '', image: '' },
    { ansEnglish: '', ansArabic: '', score: '', image: '' },
  ]);

  const handleAddOption = () => {
    setOptions([
      ...options,
      { ansEnglish: '', ansArabic: '', score: '', image: '' },
    ]);
    setFileNames([...fileNames, '']);
    fileInputRefs.current.push(null);
  };

  async function uploadImage(imageObject: any, presignedUrl: string) {
    try {
      const response = await axios.put(presignedUrl, imageObject, {
        headers: {
          'Content-Type': imageObject.type,
        },
      });

      if (response.status === 200) {
        console.log(`File ${imageObject.name} uploaded successfully!`);
      } else {
        console.error(
          `Failed to upload file ${imageObject.name}:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error uploading file ${imageObject.name}:`, error);
    }
  }

  async function handleImageSave(files: any) {
    const presignedURLs = await Setting.getPresignedURL({
      count: files?.length,
      fileExtension: 'png',
    });

    const urlsToUpdate = presignedURLs?.data?.map(
      (urlObject: any) => urlObject?.url
    );

    await Promise.all(
      files?.map((imageFile: any, index: number) =>
        uploadImage(imageFile, urlsToUpdate[index])
      )
    );

    if (currentOptionIndex !== null) {
      const images: IImages[] = (presignedURLs?.data || []).map(
        (presignURL: any, index: number) => ({
          name: files[index]?.name,
          status: Boolean(presignURL?.cdn && presignURL?.path),
          url:
            presignURL?.cdn && presignURL?.path
              ? `${presignURL.cdn}/${presignURL.path}`
              : undefined,
          imageUrl: presignURL?.path,
        })
      );
      const updatedFileNames = [...fileNames];
      updatedFileNames[currentOptionIndex] = images[0]?.name || '';
      setFileNames(updatedFileNames);

      const updatedOptions = [...options];
      updatedOptions[currentOptionIndex] = {
        ...updatedOptions[currentOptionIndex],
        image: images[0]?.url || '',
      };
      setOptions(updatedOptions);

      register(`options.${currentOptionIndex}.image`, {
        value: images[0]?.url || '',
      });
    }

    setShowImageModals(false);
    setCurrentOptionIndex(null);
  }

  return (
    <>
      {options.map((option, index) => {
        return (
          <Box key={index}>
            <Text fontWeight="regular" fontSize="baseText" color="static.black">
              Option {index + 1}
            </Text>
            <Box marginTop={2}>
              <FormField htmlFor={`english-input-${index}`}>
                <Box cssProps={{ position: 'relative' }}>
                  <Input
                    {...register(`options[${index}].ansEnglish`, {
                      required: true,
                    })}
                    style={{ paddingRight: '44px' }}
                    id={`english-input-${index}`}
                    placeholder="English option"
                  />
                  {isSavePressed && errors.options?.[index]?.ansEnglish && (
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.red"
                    >
                      Required
                    </Text>
                  )}
                </Box>
              </FormField>
              <FormField htmlFor="arabic-input">
                <Box cssProps={{ position: 'relative' }}>
                  <Input
                    {...register(`options[${index}].ansArabic`, {
                      required: true,
                    })}
                    style={{ paddingRight: '44px' }}
                    id={`arabic-input-${index}`}
                    placeholder="Arabic option"
                  />
                  {isSavePressed && errors.options?.[index]?.ansArabic && (
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.red"
                    >
                      Required
                    </Text>
                  )}
                </Box>
              </FormField>
              <Stack justify="space-between" align="center">
                <Text
                  fontWeight="regular"
                  fontSize="baseText"
                  color="static.black"
                >
                  Upload Image
                </Text>
                <FileUploadWrapper
                  onClick={() => {
                    setShowImageModals(true);
                    setCurrentOptionIndex(index);
                  }}
                >
                  <FileUploadName>{fileNames[index]}</FileUploadName>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowImageModals(true);
                      setMaxImg(1);
                    }}
                    disabled={false}
                    style={{ padding: '4px', fontSize: '12px' }}
                  >
                    <FileUploadIcon htmlFor="file-upload">
                      <UploadIcon />
                    </FileUploadIcon>
                  </Button>
                </FileUploadWrapper>
              </Stack>
              <Stack justify="flex-end" style={{ marginBottom: '10px' }}>
                {isSavePressed && !option.image && (
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.red"
                  >
                    Required
                  </Text>
                )}
              </Stack>

              <Box cssProps={{ display: 'flex', justifyContent: 'flex-end' }}>
                <FormField htmlFor={`score-input-${index}`}>
                  <Box
                    cssProps={{
                      position: 'relative',
                      width: '130px',
                    }}
                  >
                    <Input
                      {...register(`options[${index}].score`, {
                        required: {
                          value: true,
                          message: 'Required',
                        },
                        max: {
                          value: 0,
                          message: 'Score must be less than 0',
                        },
                      })}
                      id={`score-input-${index}`}
                      placeholder="Score"
                      type="number"
                    />
                    {isSavePressed && errors.options?.[index]?.score && (
                      <Text
                        fontWeight="regular"
                        fontSize="baseText"
                        color="static.red"
                      >
                        {errors.options?.[index]?.score.message}
                      </Text>
                    )}
                  </Box>
                </FormField>
              </Box>
              {option.image && (
                <Stack justify="center">
                  <ActualImage imageUrl={option.image} />
                </Stack>
              )}
            </Box>
          </Box>
        );
      })}
      <Button
        type="button"
        variant="outline"
        cssProps={{ padding: '16px 10px 16px 0' }}
        onClick={handleAddOption}
      >
        + Add more options
      </Button>
      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModals(false)}
        onSave={handleImageSave}
        isLoading={false}
        maxFiles={maxImg}
      />
    </>
  );
};

export default AddQuestionModal;
