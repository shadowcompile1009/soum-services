import { useMemo } from 'react';
import isEmpty from 'lodash.isempty';
import { useRouter } from 'next/router';

import { VendorServicesSelect } from '@/components/Shared/VendorServicesSelect';
import { useVendorServices } from '@/components/Order/hooks';
import { VendorService } from '@/models/LogisticVendor';

export function FilterVendorServices() {
  const { data: vendorServices } = useVendorServices();
  const router = useRouter();

  function handleOnSelect(values: VendorService[]) {
    const { query } = router;

    if (isEmpty(values)) {
      const newQuery = {
        ...query,
      };
      delete newQuery?.services;
      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
      return;
    }

    const services = values.map((value) => value.id).join(',');

    const newQuery = {
      ...query,
    };
    newQuery.services = services;
    router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  }

  const initialValues = useMemo(() => {
    const { query } = router;
    const services = String(query.services).split(',')!;

    return services.map((service) =>
      (vendorServices || []).find(
        (vendorService) => service === vendorService.id
      )
    );
  }, [router, vendorServices]);

  if (isEmpty(vendorServices)) return null;

  return (
    <VendorServicesSelect
      options={vendorServices!}
      handleOnSelect={handleOnSelect}
      placeholder="Filter by logistics services"
      initialValues={initialValues as VendorService[]}
    />
  );
}
