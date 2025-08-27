import { DatePicker } from '../DatePicker';
import { Stack } from '../Layouts';
import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';

const StoriesFilter = () => {
  const router = useRouter();

  const handleOnSelect = (date: string) => {
    if (isEmpty(date)) {
      const newQuery = {
        ...router.query,
      };

      delete newQuery?.filterDate;

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

    const newQuery = {
      ...router.query,
    };

    newQuery.filterDate = date;

    router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <Stack direction="horizontal" gap="5" align="start">
      <DatePicker
        onChange={handleOnSelect}
        initialDate={router.query.filterDate as string}
      />
    </Stack>
  );
};

export default StoriesFilter;
