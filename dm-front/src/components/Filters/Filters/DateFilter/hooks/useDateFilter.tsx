import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

import { Range } from 'react-date-range';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

import { Text } from '@src/components/Text';

export const useDateFilter = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: undefined,
      key: 'selection',
    },
  ]);

  const datePickerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !date[0]?.startDate ||
      !date[0]?.endDate ||
      date[0]?.startDate === date[0]?.endDate
    ) {
      const newQuery = {
        ...router.query,
      };

      delete newQuery.start;
      delete newQuery.end;

      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
    }

    if (
      date[0]?.startDate &&
      date[0]?.endDate &&
      date[0]?.startDate !== date[0]?.endDate
    ) {
      const newQuery = {
        ...router.query,
      };

      newQuery.start = format(date[0].startDate, 'dd-MM-yyyy');
      newQuery.end = format(date[0].endDate, 'dd-MM-yyyy');

      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [date[0].startDate, date[0].endDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerContainerRef.current &&
        !datePickerContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOnClick = useCallback(() => {
    setIsOpen((state) => !state);
  }, []);

  const handleDatePickerContainerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleDateChange = useCallback((item: any) => {
    setDate([item.selection]);
  }, []);

  const displayText = useMemo(() => {
    if (
      date[0]?.startDate &&
      date[0]?.endDate &&
      date[0]?.startDate !== date[0]?.endDate
    ) {
      return (
        <Text
          fontSize="baseText"
          fontWeight="baseText"
          color="static.gray"
          width="100"
        >
          {format(date[0].startDate, 'dd/MM/yyyy')} to{' '}
          {format(date[0].endDate, 'dd/MM/yyyy')}
        </Text>
      );
    }
    return (
      <Text
        fontSize="baseText"
        fontWeight="baseText"
        color="static.gray"
        width="6.875rem"
      >
        Filter by Date
      </Text>
    );
  }, [date]);

  return {
    isOpen,
    date,
    datePickerContainerRef,
    handleOnClick,
    handleDatePickerContainerClick,
    handleDateChange,
    displayText,
  };
};
