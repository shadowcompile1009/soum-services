import { isEmpty } from 'lodash';
import puppeteer from 'puppeteer';

export async function generatePDF(html = '', config = {}) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPET_EXEC_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  await page.setContent(html);

  const pdfBuffer = isEmpty(config) ? await page.pdf() : await page.pdf(config);

  await page.close();
  await browser.close();

  return pdfBuffer;
}
