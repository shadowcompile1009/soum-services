# Introduction

This is the Test Automation Framework build using Playwright automation tool for performing the Sanity and Regression testing of the Soum Web application.

## Getting Started

### Prerequisites

* Download latest Visual Studio Code
* Download Nodejs

### Build and Test

* Clone the Repo:
 
    ```git clone https://github.com/soum-sa/seo-web-automation.git```

* Download NodeModules

    ```npm install playwright```

* Add "Playwright Test for VSCode" extension in vs code
* How to run tests in headless mode

    ```npx playwright test```

* How to run specific test on command prompt (Change Test Name according to your test name)

    ```npx playwright test TestName.spec.js```

* How to run specific test in ui mode

    ```npx playwright test --ui```

* How to run specific test in specific browser

    ```npx playwright test --project=chromium```

* How to run  tests in debug mode

    ```npx playwright test --debug```

* You can also run tests through vs code if you have added the extension given above and click on the flask on left side and click on any test to run

### Report Generation

* Using Allure Reporter for Playwright to generate a combined HTML report of the tests. Just run the tests it will create the Json report under allure-results folder. Then use the following commands to make HTML report and opening that report.

    ```allure generate allure-results -o allure-report --clean```

* How to report whether passed or failed every test when it run in terminal

    ```npx playwright test --reporter=list```