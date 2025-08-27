import React, { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import 'react-day-picker/dist/style.css';
import styled from 'styled-components';
import { Box } from '../Box';
import { Button } from '../Button';
import { ArrowDownIcon } from '../Shared/ArrowDownIcon';
import { Text } from '../Text';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const PopupCalendar = ({
  setValue,
  isEndDate,
  getValues,
}: {
  setValue: any;
  isEndDate: boolean;
  getValues: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<Date | undefined>();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const combineDateTime = (date: Date, time: Date) => {
    const updatedDate = new Date(date);
    updatedDate.setHours(time.getHours());
    updatedDate.setMinutes(time.getMinutes());
    updatedDate.setSeconds(time.getSeconds());
    return updatedDate;
  };

  const saveDateTime = (date?: Date, time?: Date) => {
    if (date && time) {
      const combined = combineDateTime(date, time);
      setValue('startDate', combined.toISOString(), { shouldValidate: true });

      const endDateValue = getValues('endDate');
      if (endDateValue) {
        const startDate = new Date(combined);
        let endDate = new Date(endDateValue);

        if (endDate.toDateString() === startDate.toDateString()) {
          endDate.setHours(23, 59, 59, 999);
        } else {
          endDate.setHours(
            startDate.getHours(),
            startDate.getMinutes(),
            startDate.getSeconds(),
            startDate.getMilliseconds()
          );
        }

        setValue('endDate', endDate.toISOString(), { shouldValidate: true });
      }
    } else if (date) {
      const newDate = new Date(date);
      const startDateValue = getValues('startDate');
      const endDateValue = getValues('endDate');

      if (startDateValue && isEndDate) {
        const startDate = new Date(startDateValue);
        if (newDate.toDateString() === startDate.toDateString()) {
          newDate.setHours(23, 59, 59, 999);
        } else {
          newDate.setHours(
            startDate.getHours(),
            startDate.getMinutes(),
            startDate.getSeconds(),
            startDate.getMilliseconds()
          );
        }
      } else if (endDateValue) {
        const endDate = new Date(endDateValue);
        if (newDate.toDateString() === endDate.toDateString()) {
          newDate.setHours(23, 59, 59, 999);
        } else {
          newDate.setHours(
            endDate.getHours(),
            endDate.getMinutes(),
            endDate.getSeconds(),
            endDate.getMilliseconds()
          );
        }
      }

      setValue(isEndDate ? 'endDate' : 'startDate', newDate.toISOString(), {
        shouldValidate: true,
      });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    saveDateTime(date, selectedTime);
  };

  const handleTimeChange = (time: any) => {
    const timeDate = new Date(time);
    setSelectedTime(timeDate);
    saveDateTime(selectedDate, timeDate);
  };

  useEffect(() => {
    const currentStartDate = getValues('startDate');
    const currentEndDate = getValues('endDate');

    if (isEndDate) {
      if (currentEndDate) setSelectedDate(new Date(currentEndDate));
    } else {
      if (currentStartDate) setSelectedDate(new Date(currentStartDate));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEndDate, isOpen, getValues]);

  return (
    <Box>
      <Button
        cssProps={{
          width: '100%',
          justifyContent: 'space-between',
          border: '1px solid #ccc',
          height: '38px',
          fontSize: 2,
          color: 'static.gray',
          padding: '0 16px',
          '&:hover': {
            borderColor: 'static.black',
          },
        }}
        type="button"
        variant="outline"
        onClick={handleToggle}
      >
        <Text
          color={selectedDate ? 'static.black' : 'static.gray'}
          fontSize="baseText"
          fontWeight="baseText"
        >
          {selectedDate ? selectedDate?.toLocaleDateString() : 'Select Date'}
        </Text>
        <ArrowDownIcon />
      </Button>
      {isOpen && (
        <ModalOverlay>
          <ModalContent ref={modalRef}>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={{
                before:
                  isEndDate === false
                    ? new Date()
                    : getValues('startDate') || new Date(),
                after: isEndDate ? undefined : getValues('endDate'),
              }}
            />
            {!isEndDate && (
              <Box
                cssProps={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Datetime
                  dateFormat={false}
                  timeFormat="HH:mm:ss A"
                  inputProps={{
                    style: { textAlign: 'center' },
                  }}
                  value={selectedTime ? selectedTime : selectedDate}
                  onChange={handleTimeChange}
                />
              </Box>
            )}
            <Button
              cssProps={{ width: '100%', marginTop: '20px' }}
              variant="filled"
              onClick={() => setIsOpen(false)}
              disabled={!selectedDate}
            >
              Save
            </Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </Box>
  );
};

export default PopupCalendar;
