import { AxiosResponse } from 'axios';

export class Csv {
  static downloadFile({
    data,
    fileName,
    fileType,
  }: {
    data: string;
    fileName: string;
    fileType: string;
  }) {
    const blob = new Blob([data], { type: fileType });

    const a = document.createElement('a');
    a.download = `${fileName}.${fileType}`;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  }

  static async getExportData(getDataFn: () => Promise<AxiosResponse['data']>) {
    const data = await getDataFn();
    return data;
  }
}
