import { DateRange } from 'react-date-range';

import { Box } from '@src/components/Box';

import { DateIcon } from './DateIcon';
import { useDateFilter } from './hooks/useDateFilter';

import { dateFilterStyle, datePickerContainerStyle } from './styles';

export const DateFilter = () => {
  const {
    isOpen,
    date,
    datePickerContainerRef,
    handleOnClick,
    handleDatePickerContainerClick,
    handleDateChange,
    displayText,
  } = useDateFilter();

  return (
    <Box onClick={handleOnClick} cssProps={dateFilterStyle}>
      <DateIcon /> {displayText}
      {isOpen && (
        <Box
          onClick={handleDatePickerContainerClick}
          ref={datePickerContainerRef}
          cssProps={datePickerContainerStyle}
        >
          <DateRange
            editableDateInputs={true}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            ranges={date}
            dateDisplayFormat="dd/MM/yyyy"
          />
        </Box>
      )}
    </Box>
  );
};
