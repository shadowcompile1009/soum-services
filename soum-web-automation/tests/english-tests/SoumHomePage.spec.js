const { test, expect } = require('@playwright/test');
const testData = require('../../data/data.json')
const translations = require('../../translations/HomePage.translations');
const HomePage = require('../../pages/Home.page');
const exp = require('constants');

test.describe('Soum Home Page', () => { 
  
  let page;
  let homePage;

  test.beforeAll(async ({ browser }) => { 
    page = await browser.newPage(); 
    homePage = new HomePage(page); 
    await page.goto(process.env.url);
  });

  test('Check for the Soum logo', async () => {
    expect(await homePage.getSoumLogo()).toBe(true)
  });

  test.afterAll(async () => {
    await page.close();
  });

});
