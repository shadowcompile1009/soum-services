import React from 'react';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';

import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import { Logistics } from '@/models/Logistics';
import { toast } from '@/components/Toast';

export function VendorsPage() {
  const hiddenFileInput = React.useRef(null);

  const ImportVendorsMutation = useMutation(Logistics.ImportVendorList, {
    onSuccess() {
      toast.success(toast.getMessage('onImportVendorsSuccess'));
    },
    onError() {
      toast.error(toast.getMessage('onImportVendorsError'));
    },
  });

  const handleOnImport = () => {
    // @ts-ignore
    hiddenFileInput.current.click();
  };

  const handleOnFileChange = (e: any) => {
    const fileUploaded = e.target.files[0];
    const formData = new FormData();
    formData.append('file', fileUploaded);
    if (fileUploaded) {
      ImportVendorsMutation.mutate(formData);
      // for empty the input after upload
      e.target.value = '';
    }
  };

  return (
    <>
      <Stack direction="horizontal" justify="end" align="center" gap="3">
        <Text color="static.black" fontSize="baseText" fontWeight="semibold">
          Import Vendors
        </Text>
        <input
          type={'file'}
          ref={hiddenFileInput}
          id={'csvFileInput'}
          accept={'.csv, .xlsx'}
          style={{ display: 'none' }}
          onChange={handleOnFileChange}
        />
        <Image
          src="/assets/images/import_icon.png"
          width="30%"
          height="30%"
          objectFit="cover"
          alt="Soum logo in Black"
          style={{ cursor: 'pointer' }}
          onClick={handleOnImport}
        />
        <br />
      </Stack>
    </>
  );
}
