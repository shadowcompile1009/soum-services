import ExcelJS from 'exceljs';

export function createExcel(title: string) {
  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.calcProperties.fullCalcOnLoad = true;

  const sheet = workbook.addWorksheet(title, {
    properties: {
      tabColor: {
        argb: '#058dc5cc',
      },
    },
    views: [
      {
        state: 'frozen',
        xSplit: 1,
        ySplit: 1,
      },
    ],
  });

  const columnStyle: Partial<ExcelJS.Style> = {
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
  };

  return {
    workbook,
    sheet,
    columnStyle,
  };
}
