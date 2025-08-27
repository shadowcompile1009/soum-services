import React from 'react';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';

import { Logistics } from '@/models/Logistics';
import { Text } from '@/components/Text';
import { Stack } from '@/components/Layouts';
import { toast } from '@/components/Toast';

export function RulesPage() {
  const hiddenFileInput = React.useRef(null);

  const ImportLogisticRulesMutation = useMutation(Logistics.ImportRulesList, {
    onSuccess() {
      toast.success(toast.getMessage('onImportRulesSuccess'));
    },
    onError() {
      toast.error(toast.getMessage('onImportRulesError'));
    },
  });

  const handleImportRules = () => {
    // @ts-ignore
    hiddenFileInput.current.click();
  };

  const handleOnRulesChange = (e: any) => {
    const uploadedRules = e.target.files[0];
    const data = new FormData();
    data.append(`file`, uploadedRules);
    if (uploadedRules) {
      ImportLogisticRulesMutation.mutate(data);
      // for empty the input after upload
      e.target.value = '';
    }
  };

  return (
    <>
      <Stack direction="horizontal" justify="end" align="center" gap="3">
        <Text color="static.black" fontSize="baseText" fontWeight="semibold">
          Import Rules
        </Text>
        <input
          type={'file'}
          ref={hiddenFileInput}
          id={'csvFileInput'}
          accept={'.csv, .xlsx'}
          style={{ display: 'none' }}
          onChange={handleOnRulesChange}
        />
        <Image
          objectFit="cover"
          alt="Soum logo in Black"
          width="30%"
          height="30%"
          onClick={handleImportRules}
          style={{ cursor: 'pointer' }}
          src="/assets/images/import_icon.png"
        />
        <br />
      </Stack>
    </>
  );
}
