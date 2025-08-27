import css from '@styled-system/css';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box } from '../Box';
import { Button } from '../Button';
import { Label } from '../Form';
import { InputProps } from '../Form/Input';
import { Stack } from '../Layouts';
import { Loader } from '../Loader';
import { CommonModal } from '../Modal';
import { CloseIcon } from '../Shared/CloseIcon';
import { IconContainer } from '../Shared/IconContainer';
import { Text } from '../Text';
import PopupCalendar from './DatePickerModal';
import axios from 'axios';
import { IImages } from '../Frontliners/InspectionReport';
import { IStory, Story } from '@/models/Story';
import { useMutation } from '@tanstack/react-query';
import { Backdrop } from '../Shared/Backdrop';
import { useForm } from 'react-hook-form';
import { AddNewStoriesDTO } from '@/types/dto';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import UploadComponent from '../Shared/ImageUploadModal/UploadComponent';
import { toast } from '../Toast';
import { UploadFileIcon } from '../Shared/UploadFileIcon';

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
    height: 38,
    width: '100%',
    fontSize: 2,
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
        <></>
      )}
    </Stack>
  );
}

const FileUploadWrapper = styled.label`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 10px 16px;
  border-radius: 5px;
  width: 100%;
  height: 38px;
  cursor: pointer;
  &:hover {
    color: #000;
    border-color: #000;
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

export const DeleteQuestionActionLink = styled.span(() =>
  css({
    color: 'static.grays.10',
    cursor: 'pointer',
    '&:hover': {
      color: 'static.red',
    },
  })
);

const schema = yup.object().shape({
  nameEn: yup
    .string()
    .required('Stories name is required')
    .matches(/^[A-Za-z ]+$/, 'No numbers or special characters are allowed')
    .max(20, 'The length must not exceed 20 characters')
    .min(2, 'The length must not be less than 2 characters'),
  nameAr: yup
    .string()
    .required('Stories name is required')
    .matches(
      /^[\u0621-\u064A\s]+$/,
      'No numbers or special characters are allowed'
    )
    .max(20, 'The length must not exceed 20 characters')
    .min(2, 'The length must not be less than 2 characters'),
  iconURL: yup.string().url().required('Story icon is required'),
  storyURLs: yup
    .array()
    .required('Story URL is required')
    .min(1, 'Story URL is required and cannot be empty'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().required('End date is required'),
  position: yup.number(),
});

interface Props {
  onClose: () => void;
  isOpen: boolean;
  isLoading: boolean;
  refetch: () => void;
  story?: IStory;
}

const StoriesModal = (props: Props) => {
  const { isOpen, onClose, isLoading, refetch, story } = props;
  const [fileName, setFileName] = useState<String | undefined>('');
  const [isEdit, setIsEdit] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<AddNewStoriesDTO>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (story) {
      setIsEdit(true);
      reset({
        nameEn: story.nameEn,
        nameAr: story.nameAr,
        iconURL: story.iconURL,
        storyURLs: story.storyURLs,
        startDate: story.startDate,
        endDate: story.endDate,
        position: story.position,
      });
      setFileName(story.iconURL);
    }
  }, [story, reset]);

  const addStoriesMutation = useMutation(Story.addStory, {
    onSuccess: () => {
      refetch();
      setFileName('');
      reset();
      onClose();
      toast.success(toast.getMessage('onAddNewStorySuccess'));
    },
    onError: () => {
      onClose();
      toast.success(toast.getMessage('onAddNewStoryError'));
      reset();
      setFileName('');
    },
  });

  const updateStoriesMutation = useMutation(Story.updateStory, {
    onSuccess() {
      toast.success(toast.getMessage('onUpdateStorySuccess'));
      onClose();
      reset();
      setIsEdit(false);
      refetch?.();
    },
    onError() {
      toast.error(toast.getMessage('onUpdateStoryError'));
      onClose();
      setIsEdit(false);
    },
  });

  const handleClose = () => {
    onClose();
    setFileName('');
    reset();
  };

  async function uploadImage(
    imageObject: { type: string; name: string },
    presignedUrl: string
  ): Promise<void> {
    try {
      const { status, statusText } = await axios.put(
        presignedUrl,
        imageObject,
        {
          headers: { 'Content-Type': imageObject.type },
        }
      );

      if (status !== 200) {
        console.error(
          `Failed to upload file ${imageObject.name}: ${statusText}`
        );
      }
    } catch (error) {
      console.error(`Error uploading file ${imageObject.name}:`, error);
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const id = event.target.id;
    const files = event.target.files;
    let imageUrls;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      imageUrls = await handleImageSave(fileArray);
    }

    if (id === 'storyIcon' && imageUrls) {
      setFileName(imageUrls[0].url);
      setValue('iconURL', imageUrls[0].url, { shouldValidate: true });
    }
  };

  const handleFileStoryChange = async (files: File[]) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const imageUrls = await Promise.all(
        fileArray.map((file) => handleImageSave([file]))
      );
      const storyImages = imageUrls
        ?.flat()
        .map((imageUrl) => imageUrl?.url || '');

      const currentStoryImages = getValues('storyURLs') || [];
      const updatedStoryImages = [...currentStoryImages, ...storyImages];
      setValue('storyURLs', updatedStoryImages, { shouldValidate: true });
    }
  };

  async function handleImageSave(files: File[]) {
    if (!files || files.length === 0) return;

    const extension = files[0].name.split('.').pop();
    const fileExtension = extension ?? 'unknown';

    const { data: presignedData } = await Story.getPresignedURL({
      count: files?.length?.toString(),
      fileExtension,
    });
    const urlsToUpdate = presignedData?.map((urlObject: any) => urlObject.url);

    await Promise.all(
      files.map((imageFile, index) =>
        uploadImage(imageFile, urlsToUpdate[index])
      )
    );
    const images: IImages[] = files.map((file, index) => {
      const presignURL: any = presignedData[index];
      const imageUrl: string | undefined =
        presignURL?.cdn && presignURL?.path
          ? `${presignURL.cdn}/${presignURL.path}`
          : undefined;

      return {
        name: file.name,
        status: Boolean(imageUrl),
        url: imageUrl,
        imageUrl: presignURL?.path,
      };
    });

    return images;
  }

  if (isLoading) {
    return (
      <CommonModal onClose={onClose} isOpen={isOpen}>
        <Box
          cssProps={{
            width: 580,
            height: 480,
            margin: -10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader size="48px" border="static.blue" marginRight="0" />
        </Box>
      </CommonModal>
    );
  }

  if (isLoading) {
    return (
      <CommonModal onClose={onClose} isOpen={isOpen}>
        <Box
          cssProps={{
            width: 580,
            height: 480,
            margin: -10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader size="48px" border="static.blue" marginRight="0" />
        </Box>
      </CommonModal>
    );
  }

  async function onSubmit(formValues: AddNewStoriesDTO) {
    if (story) {
      updateStoriesMutation.mutateAsync({ id: story.id, formValues });
    } else {
      addStoriesMutation.mutateAsync(formValues);
    }
  }

  return (
    <CommonModal isOpen={isOpen} onClose={handleClose}>
      {(addStoriesMutation.isLoading || updateStoriesMutation.isLoading) && (
        <Backdrop>
          <Loader size="48px" border="static.blue" marginRight="0" />
        </Backdrop>
      )}
      <form id="add-stories" onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="vertical" gap="5">
          <Box paddingBottom={5} cssProps={{ borderBottom: '1px solid #ccc' }}>
            <Stack
              direction="horizontal"
              justify="space-between"
              align="center"
              flex="1"
            >
              <Text
                color="static.black"
                fontSize="bigText"
                fontWeight="regular"
              >
                {isEdit ? 'Edit Stories' : 'Add Stories'}
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
          <Stack direction="vertical" gap="5">
            <FormField
              htmlFor="storyNameEn"
              label="Story Name*"
              error={errors?.nameEn?.message}
              color="static.grays.10"
            >
              <Text
                color="static.gray"
                fontSize="smallText"
                fontWeight="smallText"
              >
                Must min be(2) and max be(20) characters
              </Text>
              <Input
                placeholder="Type Stories name in English"
                id="storyNameEn"
                autoComplete="off"
                {...register('nameEn', { required: true })}
              />
            </FormField>
            <FormField
              htmlFor="storyNameEn"
              error={errors?.nameAr?.message}
              color="static.grays.10"
            >
              <Input
                placeholder="Type Stories name in Arabic"
                id="storyNameAr"
                autoComplete="off"
                {...register('nameAr', { required: true })}
              />
            </FormField>
            <FormField
              className="grid w-full max-w-sm items-center gap-1.5"
              label="Add Icon*"
              htmlFor="storyIcon"
              error={errors?.iconURL?.message}
            >
              <FileUploadWrapper htmlFor="storyIcon">
                <FileUploadName>
                  {fileName ? fileName : getValues('iconURL')}
                </FileUploadName>
                <UploadFileIcon />
                <FileUploadIcon htmlFor="storyIcon">
                  <Input
                    hidden
                    id="storyIcon"
                    type="file"
                    accept="image/*"
                    onChange={(event: any) => {
                      handleFileChange(event);
                    }}
                  />
                </FileUploadIcon>
              </FileUploadWrapper>
            </FormField>
            <Stack direction="vertical">
              <FormField
                className="grid w-full max-w-sm items-center gap-1.5"
                label="Add Images/Videos*"
                htmlFor="storyURLs"
                error={errors?.storyURLs?.message}
              >
                <UploadComponent
                  handleFile={handleFileStoryChange}
                  getValues={getValues}
                />
              </FormField>
            </Stack>
          </Stack>
          <Stack direction="horizontal" gap="5">
            <Stack direction="vertical" gap="8" flex="1">
              <FormField
                className="grid w-full max-w-sm items-center gap-1.5"
                label="Start Date*"
                htmlFor="startDate"
                error={errors.startDate?.message}
              >
                <PopupCalendar
                  setValue={setValue}
                  isEndDate={false}
                  getValues={getValues}
                />
              </FormField>
            </Stack>
            <Stack direction="vertical" gap="5" flex="1">
              <FormField
                className="grid w-full max-w-sm items-center gap-1.5"
                label="End Date*"
                htmlFor="endDate"
                error={errors.endDate?.message}
              >
                <PopupCalendar
                  isEndDate={true}
                  setValue={setValue}
                  getValues={getValues}
                />
              </FormField>
            </Stack>
          </Stack>

          <Box marginTop={5} cssProps={{ width: '100%' }}>
            <Button type="submit" cssProps={{ width: '100%' }} variant="filled">
              {isEdit ? 'Edit Stories' : 'Add Stories'}
            </Button>
          </Box>
        </Stack>
      </form>
    </CommonModal>
  );
};

export default StoriesModal;
