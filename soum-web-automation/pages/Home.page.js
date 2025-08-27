const { expect } = require('@playwright/test');
const BasePage = require('../pages/Base.page');
const ElementHelper = require('../utils/element.helper');

class HomePage extends BasePage{

    constructor(page){
        const element = '(//a[@href="/en"])[3]'
        super (page , element)
        this.guide = global.language              == "english" ? this.page.locator('//p[text()="Selling Guide on Soum Platform"]') : this.page.locator('//p[text()="دليل البيع في منصة سوم"]');
        this.itemsPerPage                          = page.locator('//div[@class="MppBoard-styled__Root-sc-fa60a116-0 jQyMjo"]//div[1]//div[1]');
      }

    async switchToArabic() {
      await ElementHelper.clickElement(this.page, this.arabicButton);
      await ElementHelper.waitForDisplayed(this.page, this.arabicButton);
    }

    async getSearchTab() {
      return ElementHelper.isElementDisplayed(this.page, this.searchBar);
    }
    async typeSearch(searchitem) {
      await ElementHelper.typeValue(this.page, this.searchBar, searchitem);
      await ElementHelper.clickElement(this.page, this.searchButton);
    }

    async clickSoumBlog() {
      return await ElementHelper.isElementDisplayed(this.page, this.blogButton);
    }

}
module.exports = HomePage;