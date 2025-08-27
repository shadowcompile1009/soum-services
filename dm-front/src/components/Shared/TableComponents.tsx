import styled from 'styled-components';
import css from '@styled-system/css';
import { format, isValid } from 'date-fns';
import { ThHTMLAttributes } from 'react';

interface TableDateViewProps {
  date: Date;
}

interface TProps extends ThHTMLAttributes<HTMLTableHeaderCellElement> {
  textAlign?: 'left' | 'center' | 'right';
}

export function TableDateView(props: TableDateViewProps) {
  const { date } = props;

  if (!isValid(new Date(date))) {
    return (
      <>
        <span> - </span>
        <br />
        <span> - </span>
      </>
    );
  }

  return (
    <>
      <span>{format(new Date(date), 'dd/MM/yyyy')}</span>
      <br />
      <span>{format(new Date(date), 'hh:mm:ss aa')}</span>
    </>
  );
}

export const TableContainer = styled.div(() =>
  css({
    flex: 1,
    padding: 10,
    backgroundColor: 'static.white',
    border: '1px solid',
    borderColor: 'static.grays.25',
    borderRadius: 4,
    boxShadow: 2,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    whiteSpace: 'nowrap',
    marginBottom: 10,
  })
);

export const OverflowWrapper = styled.div(() =>
  css({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflowX: 'auto',
    flex: 1,
  })
);

export const Table = styled.table(() =>
  css({
    tableLayout: 'fixed',
  })
);

export const THead = styled.thead(() =>
  css({
    width: '100%',
    whiteSpace: 'nowrap',
    verticalAlign: 'bottom',
    '& tr': {
      backgroundColor: 'static.blues.10',
    },
  })
);

export const TBody = styled.tbody(() =>
  css({
    width: '100%',
    whiteSpace: 'nowrap',
    verticalAlign: 'bottom',
    color: 'static.blues.500',
    '& tr:nth-child(even)': {
      backgroundColor: '#f2f2f2',
    },
  })
);

export const THeadCell = styled.th<TProps>(({ textAlign = 'center' }) =>
  css({
    paddingX: 4,
    paddingY: 8,
    fontSize: 'smallText',
    fontWeight: 'semibold',
    textAlign,
  })
);

export const TBodyCell = styled.td<TProps>(({ textAlign = 'center' }) =>
  css({
    paddingX: 2,
    paddingY: 4,
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSize: '0.75rem',
    fontWeight: 'regular',
    textAlign,
    maxWidth: 230,
    wordWrap: 'break-word',
    whiteSpace: 'normal',
    verticalAlign: 'middle',
  })
);
