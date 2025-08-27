'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DeleteIcon } from '../Shared/DeleteIcon';
import { IconContainer } from '../Shared/IconContainer';
import { Stack } from '../Layouts';

interface DatePickerProps {
  initialDate: string;
  onChange: (value: string) => void;
}

export function DatePicker({ onChange, initialDate }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>(
    initialDate ? new Date(initialDate as string) : (null as unknown as Date)
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const parsedDate = new Date(initialDate as string);
    if (!isNaN(parsedDate.getTime())) {
      setDate(parsedDate);
    }
  }, []);

  const handleChange = (date: Date | undefined) => {
    if (date) {
      const updatedDate = new Date(date);
      updatedDate.setHours(0, 0, 0, 0);
      const dateString = updatedDate.toISOString();
      onChange(dateString);
      setDate(date);
    }

    setOpen(false);
  };

  const handleDeleteDate = (event: any) => {
    event.stopPropagation();
    setDate(null as unknown as Date);
    onChange('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[300px] h-[45px] justify-between text-left font-normal focus:outline-none focus-visible:outline-none hover:bg-white hover:border-black',
            !date && 'text-muted-foreground'
          )}
          style={{ borderColor: '#3A57E8' }}
        >
          <Stack direction="horizontal" style={{ cursor: 'pointer' }}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, 'PPP')
            ) : (
              <span
                style={{
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginLeft: '8px',
                }}
              >
                Filter by Date
              </span>
            )}
          </Stack>
          {date && (
            <Button
              variant={'outline'}
              className="border-none shadow-none hover:bg-transparent hover:border-none focus:outline-none focus:shadow-none"
              onClick={(e) => handleDeleteDate(e)}
            >
              <IconContainer style={{ cursor: 'pointer' }} color="static.red">
                <DeleteIcon />
              </IconContainer>
            </Button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[1050] overflow-hidden">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
