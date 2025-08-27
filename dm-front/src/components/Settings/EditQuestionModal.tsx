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
import { useMutation } from '@tanstack/react-query';
import { IQuestion, Setting } from '@/models/Setting';
import { toast } from '../Toast';
import { useForm } from 'react-hook-form';
import { ImageUploadModal } from '../Shared/ImageUploadModal';
import axios from 'axios';
import { UploadIcon } from '../Shared/UploadIcon';
import { ActualImage } from '../Frontliners/ActualImage';
import { Switch } from '../Switch';
import {
  IImages,
  IOption,
  templateLevels,
  templateOptions,
} from './AddQuestionModal';

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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refetchQuestions: () => void;
  data: IQuestion;
}

const EditQuestionModal = ({
  isOpen,
  onClose,
  refetchQuestions,
  data,
}: Props) => {
  const [selectedTypeQuestion, setTypeQuestion] = useState<IOption | undefined>(
    templateOptions.find((option) => option.value === data.questionType)
  );

  const [options, setOptions] = useState<any[]>([]);
  const [isSavePressed, setIsSavePressed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const initializeForm = (questionData: any) => {
    if (questionData?.questionType === 'yes-no') {
      reset({
        question_en: questionData.questionEn,
        question_ar: questionData.questionAr,
        yes_score: questionData.options?.[0]?.score,
        no_score: questionData.options?.[1]?.score,
      });
    } else {
      reset({
        question_en: questionData.questionEn,
        question_ar: questionData.questionAr,
      });
    }

    setOptions(
      questionData.options?.map((option: any) => ({
        ansEnglish: option.nameEn,
        ansArabic: option.nameAr,
        score: option.score,
        imageUrl: option.imageUrl,
        level: option.level,
      })) || []
    );

    setTypeQuestion(
      templateOptions.find(
        (option) => option.value === questionData.questionType
      )
    );
  };

  useEffect(() => {
    if (isOpen && data) {
      initializeForm(data);
    }
  }, [isOpen, data, reset]);

  const handleChange = (option: SingleValue<IOption>) => {
    setTypeQuestion(option ?? undefined);
    setIsSavePressed(false);
    if (option?.value !== data.questionType) {
      reset({
        question_en: '',
        question_ar: '',
        yes_score: '',
        no_score: '',
      });
      setOptions([]);
    } else {
      initializeForm(data);
    }
  };

  const { mutate: editQuestionSettings } = useMutation(
    Setting.editQuestionSettings,
    {
      onSuccess() {
        toast.success(toast.getMessage('onEditQuestionSuccess'));
        onClose();
        reset();
        refetchQuestions();
        setIsSavePressed(false);
      },
      onError() {
        toast.error(toast.getMessage('onEditQuestionError'));
        reset();
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
          option.imageUrl
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
      questionType: selectedTypeQuestion.value,
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
          ? data.options.map((option: any) => ({
              nameEn: option.ansEnglish || '',
              nameAr: option.ansArabic || '',
            }))
          : selectedTypeQuestion?.value === 'multiple-choice'
          ? formValues.options.map((option: any) => ({
              nameEn: option.ansEnglish,
              nameAr: option.ansArabic,
              score: option.score || 0,
            }))
          : selectedTypeQuestion?.value === 'dropdown'
          ? formValues.options.map((option: any) => ({
              nameEn: option.ansEnglish,
              nameAr: option.ansArabic,
              score: option.score || 0,
            }))
          : selectedTypeQuestion?.value === 'single-choice-with-photos'
          ? formValues.options
            ? formValues.options.map((option: any) => ({
                nameEn: option.ansEnglish,
                nameAr: option.ansArabic,
                score: option.score || 0,
                imageUrl: option.imageUrl,
                level: option.level ? option.level : 'good',
              }))
            : options.map((option: any) => ({
                nameEn: option.ansEnglish,
                nameAr: option.ansArabic,
                score: option.score || 0,
                imageUrl: option.imageUrl,
                level: option.level ? option.level : 'good',
              }))
          : selectedTypeQuestion?.value === 'multiple-choice-with-photos'
          ? formValues.options
            ? formValues.options.map((option: any) => ({
                nameEn: option.ansEnglish,
                nameAr: option.ansArabic,
                score: option.score || 0,
                imageUrl: option.imageUrl,
              }))
            : options.map((option: any) => ({
                nameEn: option.ansEnglish,
                nameAr: option.ansArabic,
                score: option.score || 0,
                imageUrl: option.imageUrl,
              }))
          : [],
    };
    editQuestionSettings({
      questionId: data.questionId,
      formValues: questionData,
    });
  };

  const handleClose = () => {
    reset();
    onClose();
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
                Edit question
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
              register={register}
              setValue={setValue}
              errors={errors}
              data={data}
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
              ) : selectedTypeQuestion?.value ===
                'single-choice-with-photos' ? (
                <SingleChoiceWithPhotos
                  setValue={setValue}
                  register={register}
                  options={options}
                  errors={errors}
                  isSavePressed={isSavePressed}
                />
              ) : selectedTypeQuestion?.value ===
                'multiple-choice-with-photos' ? (
                <MultipleChoiceWithPhotos
                  setValue={setValue}
                  register={register}
                  options={options}
                  errors={errors}
                  isSavePressed={isSavePressed}
                />
              ) : selectedTypeQuestion?.value === 'dropdown' ? (
                <DropdownQuestion
                  setValue={setValue}
                  register={register}
                  options={options}
                  errors={errors}
                />
              ) : (
                <MultipleChoiceQuestion
                  setValue={setValue}
                  register={register}
                  options={options}
                  errors={errors}
                />
              )}
            </Box>
          )}
          <Button
            type="submit"
            variant="filled"
            cssProps={{ width: '100%' }}
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
                ل
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

const SingleChoiceWithPhotos = ({
  register,
  options: initialOptions,
  setValue,
  errors,
  isSavePressed,
}: {
  register: any;
  options: any;
  setValue: any;
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
  const [options, setOptions] = useState(
    initialOptions.length === 0
      ? [
          {
            ansEnglish: '',
            ansArabic: '',
            score: '',
            imageUrl: '',
            level: 'good',
          },
          {
            ansEnglish: '',
            ansArabic: '',
            score: '',
            imageUrl: '',
            level: 'good',
          },
        ]
      : initialOptions
  );

  const [selectedTypeLevels, setTypeLevels] = useState<
    Array<IOption | undefined>
  >(
    options.map((option: any) =>
      templateLevels.find((template) => template.value === option.level)
    )
  );

  const handleAddOption = () => {
    setOptions([
      ...options,
      { ansEnglish: '', ansArabic: '', score: '', imageUrl: '', level: 'good' },
    ]);
    setTypeLevels([
      ...selectedTypeLevels,
      templateLevels.find((option) => option.value === 'good'),
    ]);
    fileInputRefs.current.push(null);
  };

  useEffect(() => {
    options.forEach((option: any, index: number) => {
      setValue(`options[${index}].ansEnglish`, option.ansEnglish);
      setValue(`options[${index}].ansArabic`, option.ansArabic);
      setValue(`options[${index}].score`, option.score);
      setValue(`options[${index}].imageUrl`, option.imageUrl);
      setValue(`options[${index}].level`, option.level);
    });
  }, [setValue]);

  const handleChangeLevel = (option: SingleValue<IOption>, index: number) => {
    const updatedTypeLevels = [...selectedTypeLevels];
    updatedTypeLevels[index] = option ?? undefined;
    setTypeLevels(updatedTypeLevels);

    setValue(`options.${index}.level`, option?.value || '', {
      shouldValidate: true,
    });
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
      setFileNames((prevFileNames) => {
        const updatedFileNames = [...prevFileNames];
        updatedFileNames[currentOptionIndex] = images[0]?.name || '';
        return updatedFileNames;
      });

      setOptions((prevOptions: any) =>
        prevOptions.map((option: any, idx: any) =>
          idx === currentOptionIndex
            ? { ...option, imageUrl: images[0]?.url || '' }
            : option
        )
      );

      register(`options.${currentOptionIndex}.imageUrl`, {
        value: images[0]?.url || '',
      });
    }

    setShowImageModals(false);
    setCurrentOptionIndex(null);
  }

  return (
    <>
      {options.map((option: any, index: any) => {
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
                    defaultValue={option.ansEnglish}
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
                    defaultValue={option.ansArabic}
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
                {isSavePressed && !option.imageUrl && (
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
                        required: { value: true, message: 'Required' },
                        max: {
                          value: 0,
                          message: 'Score must be less than 0',
                        },
                      })}
                      id={`score-input-${index}`}
                      placeholder="Score"
                      type="number"
                      defaultValue={option.score}
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
              {option.imageUrl && (
                <Stack justify="center">
                  <ActualImage imageUrl={option.imageUrl} />
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
  options: initialOptions,
  setValue,
  errors,
  isSavePressed,
}: {
  register: any;
  options: any;
  setValue: any;
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
  const [options, setOptions] = useState(
    initialOptions.length === 0
      ? [
          { ansEnglish: '', ansArabic: '', score: '', imageUrl: '' },
          { ansEnglish: '', ansArabic: '', score: '', imageUrl: '' },
        ]
      : initialOptions
  );

  const handleAddOption = () => {
    setOptions([
      ...options,
      { ansEnglish: '', ansArabic: '', score: '', imageUrl: '' },
    ]);
    fileInputRefs.current.push(null);
  };

  useEffect(() => {
    options.forEach((option: any, index: number) => {
      setValue(`options[${index}].ansEnglish`, option.ansEnglish);
      setValue(`options[${index}].ansArabic`, option.ansArabic);
      setValue(`options[${index}].score`, option.score);
      setValue(`options[${index}].imageUrl`, option.imageUrl);
    });
  }, [options, setValue]);

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
      setFileNames((prevFileNames) => {
        const updatedFileNames = [...prevFileNames];
        updatedFileNames[currentOptionIndex] = images[0]?.name || '';
        return updatedFileNames;
      });

      setOptions((prevOptions: any) =>
        prevOptions.map((option: any, idx: any) =>
          idx === currentOptionIndex
            ? { ...option, imageUrl: images[0]?.url || '' }
            : option
        )
      );

      register(`options.${currentOptionIndex}.imageUrl`, {
        value: images[0]?.url || '',
      });
    }

    setShowImageModals(false);
    setCurrentOptionIndex(null);
  }

  return (
    <>
      {options.map((option: any, index: any) => {
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
                    defaultValue={option.ansEnglish}
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
                    defaultValue={option.ansArabic}
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
                {isSavePressed && !option.imageUrl && (
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
                      defaultValue={option.score}
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
              {option.imageUrl && (
                <Stack justify="center">
                  <ActualImage imageUrl={option.imageUrl} />
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

const TextQuestion = ({
  register,
  errors,
  setValue,
  data,
}: {
  register: any;
  errors: any;
  setValue: any;
  data: any;
}) => {
  const [isMandatory, setIsMandatory] = useState(data.isMandatory);
  setValue('status', isMandatory);

  console.log(data);

  useEffect(() => {
    if (data.questionType === 'input-text') {
      setValue(`sub_en`, data.subTextEn);
      setValue(`sub_ar`, data.subTextAr);
      setValue(`placeholder_ar`, data.placeholderTextAr);
      setValue(`placeholder_en`, data.placeholderTextEn);
      setValue(`text_en`, data.questionEn);
      setValue(`text_ar`, data.questionAr);
    }
  }, [data, setValue]);

  const toggleClickHandler = () => {
    setIsMandatory((prev: any) => {
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
      <Box marginBottom={10}>
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

const MultipleChoiceQuestion = ({
  register,
  options: initialOptions,
  setValue,
  errors,
}: {
  register: any;
  options: any;
  setValue: any;
  errors: any;
}) => {
  const [options, setOptions] = useState(
    initialOptions.length === 0
      ? [
          { ansEnglish: '', ansArabic: '', score: '' },
          { ansEnglish: '', ansArabic: '', score: '' },
        ]
      : initialOptions
  );

  const handleAddOption = () => {
    setOptions([
      ...options,
      { ansEnglish: '', ansArabic: '', score: '', imageUrl: '' },
    ]);
  };

  useEffect(() => {
    options.forEach((option: any, index: number) => {
      setValue(`options[${index}].ansEnglish`, option.ansEnglish);
      setValue(`options[${index}].ansArabic`, option.ansArabic);
      setValue(`options[${index}].score`, option.score);
    });
  }, [options, setValue]);

  return (
    <>
      {options.map((option: any, index: any) => {
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
                    defaultValue={option.ansEnglish}
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
                    defaultValue={option.ansArabic}
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
                      defaultValue={option.score}
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
              {option.imageUrl && (
                <Stack justify="center">
                  <ActualImage imageUrl={option.imageUrl} />
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
    </>
  );
};

const DropdownQuestion = ({
  register,
  options: initialOptions,
  setValue,
  errors,
}: {
  register: any;
  options: any;
  setValue: any;
  errors: any;
}) => {
  const [options, setOptions] = useState(
    initialOptions.length === 0
      ? [
          { ansEnglish: '', ansArabic: '', score: '' },
          { ansEnglish: '', ansArabic: '', score: '' },
        ]
      : initialOptions
  );

  const handleAddOption = () => {
    setOptions([...options, { ansEnglish: '', ansArabic: '', score: '' }]);
  };

  useEffect(() => {
    options.forEach((option: any, index: number) => {
      setValue(`options[${index}].ansEnglish`, option.ansEnglish);
      setValue(`options[${index}].ansArabic`, option.ansArabic);
      setValue(`options[${index}].score`, option.score);
    });
  }, [options, setValue]);

  return (
    <>
      {options.map((option: any, index: any) => {
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
                    defaultValue={option.ansEnglish}
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
                    defaultValue={option.ansArabic}
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
                      defaultValue={option.score}
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

export default EditQuestionModal;
