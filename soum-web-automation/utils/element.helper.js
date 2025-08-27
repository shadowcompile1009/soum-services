class ElementHelper {

    async isElementDisplayed(page ,element) {
        try {
            await element.waitFor({ state: 'visible', timeout: 20000 });
            return true
        }
        catch (err) {
            return false
        }
    }

    async isElementHidden(page ,element) {
        try {
            await element.waitFor({ state: 'hidden', timeout: 10000 });
            return true
        }
        catch (err) {
            return false
        }
    }

    async clickElement(page, element) {
        try {
            await element.click();
            await element.waitFor({ state: 'visible', timeout: 10000 });
        } catch (error) {
            return false
        }
    }

    async dblClickElement(page, element) {
        try {
            await element.dblclick();
            await element.waitFor({ state: 'visible', timeout: 10000 });
        } catch (error) {
            return false
        }
    }
    
    async typeValue(page, element , value) {
        try {
            const elements = await element.type(value);
            await element.waitFor({ state: 'visible', timeout: 10000 });
            return elements;
        } catch (error) {
            return false
        }
    } 
    
    async enterValue(page, element, value) {
        await page.fill(element, value)
    }

    async waitForButtonEnabled(page, element) {
        while (await page.locator(element).isEnabled({ setTimeout: 10000 })) { }
    }

    async getElementText(page, element) {
        try {
            const text = await element.textContent();
            return text;
        } catch (error) {
            return false
        }
    }
    async waitForDisplayed(page) {
        try {
            await page.waitForTimeout(6000);
            return true
        }
        catch (err) {
            //console.error("element is not displayed after 10000 ms")
            return false
        }

    }
    async waitForElementRemoved(page, element) {
        try {
            await page.waitForSelector(element, { state: 'hidden', timeout: 60000 });
            return true
        }
        catch (err) {
            return "element is still displayed after 60000 ms" + err
        }

    }
    async getDialogMessage(page) {
        page.on('dialog', async (dialog) => {
            return dialog.message()
        })
    }

    async getInnerText(page, element, nth = 0) {
        return await page.locator(element).innerText()
    }
    async scrollIfNeeded(page, element) {
        await page.locator(element).scrollIntoView()
    }

    async getElementAttribute(page, element, attribute = 'value', disabled = false) {
        let element_on_page = await page.waitForSelector(element)
        if (disabled) {
            // Get the value attribute of the input element using evaluateHandle
            const valueHandle = await element_on_page.evaluateHandle((el) => el.value);
            return await valueHandle.jsonValue();
        } else 
            return await element_on_page.getAttribute(attribute);
    }

    async findVisibleElement(page, elements) {
        for (const element of elements) {
            try {
                await page.waitForDisplayed(element, { state: 'visible' });
                return element;
            } catch (error) {
                // Element is not visible, continue to the next one
            }
        }
        throw new Error('No visible element found');
    }

    async  scrollToBottom(page) {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
    }
      
    async scrollDownToBottom(page) {
        await page.evaluate(async () => {
          await new Promise((resolve, reject) => {
            const maxScrollAttempts = 10; // Adjust as needed
            let currentScrollAttempt = 0;
            
            const intervalId = setInterval(() => {
              window.scrollBy(0, window.innerHeight);
              currentScrollAttempt++;
              
              if (currentScrollAttempt >= maxScrollAttempts) {
                clearInterval(intervalId);
                resolve();
              }
            }, 500); // Adjust scroll interval as needed
          });
        });
    }
    
    async countElements(page, locator) {
        return await locator.count();
    }
}
module.exports = new ElementHelper()