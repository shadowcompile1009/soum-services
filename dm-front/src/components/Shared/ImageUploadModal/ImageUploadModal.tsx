import styled from 'styled-components';
import css from '@styled-system/css';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

import { Loader } from '@/components/Loader';
import { DeleteIcon } from '@/components/Shared/DeleteIcon';
import { Button } from '@/components/Button';
import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import { CommonModal } from '@/components/Modal';
import { IconContainer } from '@/components/Shared/IconContainer';
import { DownloadFileIcon } from '@/components/Shared/DownloadFileIcon';

interface ImageUploadModalProps {
  onClose: () => void;
  isOpen: boolean;
  onSave: (images: PreviewFile[]) => void;
  isLoading: boolean;
  maxFiles?: number;
}

interface PreviewFile extends File {
  preview: string;
}

const DragContainer = styled('div')(() =>
  css({
    height: 30,
    border: '3px dotted',
    borderColor: 'static.grays.100',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    '& p, & svg': {
      cursor: 'pointer',
    },
  })
);

const ImageContainer = styled('div')(() =>
  css({
    borderRadius: 4,
    border: '1px solid',
    borderColor: 'static.grays.100',
    overflow: 'hidden',
    width: 150,
    height: 150,
    position: 'relative',
  })
);

const DeleteContainer = styled('div')(() =>
  css({
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    height: '24px',
    width: '24px',
    backgroundColor: 'static.white',
    cursor: 'pointer',
    '& svg': {
      cursor: 'pointer',
    },
  })
);

const Aside = styled('aside')(() =>
  css({
    display: 'flex',
    '> *:not(:last-child)': {
      marginRight: 10,
      marginBottom: 10,
    },
  })
);

export function ImageUploadModal(props: ImageUploadModalProps) {
  const { onClose, isOpen, onSave, isLoading, maxFiles } = props; // Default maxFiles to 5
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      if (maxFiles && files.length + newFiles.length > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} files.`);
        return;
      }

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
    onDropRejected: () => {
      alert('Unsupported file format');
    },
  });

  function handleRemoveFiles(name: string) {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== name));
  }

  function handleSaveImage() {
    onSave(files);
  }

  function handleModalClose() {
    onClose();
    setFiles([]);
  }

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  useEffect(() => {
    if (isOpen) {
      setFiles([]); // Reset files when the modal opens
    }
  }, [isLoading]);

  useEffect(() => {
    if (isOpen) {
      setFiles([]); // Reset files when the modal opens
    }
  }, [isOpen]);

  return (
    <CommonModal onClose={handleModalClose} isOpen={isOpen}>
      <Stack gap="5" direction="vertical">
        <DragContainer {...getRootProps()}>
          <input {...getInputProps()} />
          <Stack gap="5">
            <IconContainer>
              <DownloadFileIcon />
            </IconContainer>
            <Text
              color="static.grays.500"
              fontSize="baseText"
              fontWeight="baseText"
            >
              Drag n drop some files here, or click to select files
            </Text>
          </Stack>
        </DragContainer>

        <Aside>
          {files.map((file) => (
            <ImageContainer key={file.name}>
              <DeleteContainer onClick={() => handleRemoveFiles(file.name)}>
                <IconContainer color="static.red">
                  <DeleteIcon />
                </IconContainer>
              </DeleteContainer>
              <Image
                src={file.preview}
                alt="selected image"
                width="100%"
                height="100%"
                objectFit="cover"
                layout="responsive"
                onLoad={() => {
                  URL.revokeObjectURL(file.preview);
                }}
              />
            </ImageContainer>
          ))}
        </Aside>
        <Stack direction="horizontal" gap="10">
          <Button
            variant="filled"
            onClick={handleSaveImage}
            disabled={isLoading || files.length === 0}
          >
            {isLoading && <Loader size="12px" border="static.blue" />} Save
          </Button>
          <Button variant="red_filled" onClick={handleModalClose}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </CommonModal>
  );
}
