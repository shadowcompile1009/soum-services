import React from 'react';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';

import { Logistics } from '@/models/Logistics';
import { Text } from '@/components/Text';
import { Stack } from '@/components/Layouts';
import { toast } from '@/components/Toast';

export function CityTiersPage() {
  const hiddenIconInput = React.useRef(null);

  const ImportCityTiersMutation = useMutation(Logistics.ImportCitiesTiers, {
    onSuccess() {
      toast.success(toast.getMessage('onImportTiersSuccess'));
    },
    onError() {
      toast.error(toast.getMessage('onImportTiersError'));
    },
  });

  const handleOnImportTiers = () => {
    // @ts-ignore
    hiddenIconInput.current.click();
  };

  const handleOnChange = (e: any) => {
    const formData = new FormData();
    const fileUploaded = e.target.files[0];
    formData.append('file', fileUploaded);
    if (fileUploaded) {
      ImportCityTiersMutation.mutate(formData);
      // for empty the input after upload
      e.target.value = '';
    }
  };

  return (
    <>
      <Stack direction="horizontal" justify="end" align="center" gap="3">
        <Text color="static.black" fontSize="baseText" fontWeight="semibold">
          Import Tiers
        </Text>
        <input
          type={'file'}
          ref={hiddenIconInput}
          id={'csvFileInput'}
          accept={'.csv, .xlsx'}
          style={{ display: 'none' }}
          onClick={handleOnChange}
        />
        <Image
          src="/assets/images/import_icon.png"
          width="30%"
          height="30%"
          objectFit="cover"
          alt="Soum logo in Black"
          style={{ cursor: 'pointer' }}
          onClick={handleOnImportTiers}
        />
        <br />
      </Stack>
    </>
  );
}
