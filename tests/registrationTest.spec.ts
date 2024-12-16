import {test, expect} from '@playwright/test';
import { RegistrationPage } from '../pages/registration-page';
import {HomePage} from "../pages/home-page";
import {BALANCE_DETAILS, BILL_PAY_RESULT} from "../selectors/homepage-selectors";
import {ACCOUNT_CREATION_TEXT, RIGHT_PANEL} from "../selectors/registration-locators";


test.describe('Para Bank', ()=>{
  let homePage: HomePage;
  let registrationPage: RegistrationPage;
  let userName:string;

  test.beforeEach('register the user', async ({page})=>{
    await page.goto('/');
    registrationPage = new RegistrationPage(page);
    homePage = new HomePage(page);

    await registrationPage.clickOnRegisterLink();
    userName = registrationPage.getRandomUserName("ParaUser");
    await registrationPage.fillRegistrationDetails(userName);
    await registrationPage.submitRegistrationForm();

    await expect(page.locator(RIGHT_PANEL)).toContainText(ACCOUNT_CREATION_TEXT);
  })

  test('log in', async({page}) => {
      await registrationPage.clickOnLogOut();
      await registrationPage.logInWithUserName(userName);

      await expect(page.locator('[id="showOverview"]')).toContainText('Accounts Overview');
  })

  test('Global Navigation links check', async() => {
    const baseUrl = 'https://parabank.parasoft.com/parabank/';
    await homePage.verifyGlobalNavigationLinks(baseUrl);
  });

  test('savings Account', async({page}) => {
    let accountNumber:string;
    const amount  = '300';

    await test.step('create savings account', async ()=>{
      await homePage.goToNewAccountCreationPage();
      await homePage.createSavingsAccount();

      accountNumber = await homePage.getTheAccountNumber();
    })

    await test.step('balance detail check', async ()=>{
      await homePage.goToAccountOverviewPage();

      await page.waitForTimeout(3000);
      const balanceDetails = await page.locator(BALANCE_DETAILS).all();

      expect(await balanceDetails[0].textContent()).toContain(accountNumber);
      expect(await balanceDetails[1].textContent()).toBe('$100.00');
      expect(await balanceDetails[2].textContent()).toBe('$100.00');
    });

    await test.step('fund transfer', async ()=>{
      await homePage.goToFundTransferPage();

      await homePage.transferFunds(accountNumber);

      const transferred = page.locator('div[id="showResult"]');

      await expect(transferred).toContainText('Transfer Complete!');
    });

    await test.step('bill pay', async ()=>{
      await homePage.goToBillPayPage();
      await homePage.fillPayeeDetails(accountNumber, amount);

      await homePage.clickOnSendPayment();
      await expect(page.locator(BILL_PAY_RESULT)).toBeVisible();

    })

    await test.step('find transaction', async ()=>{
      const response = await page.request.get(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountNumber}/transactions/amount/${amount}?timeout=30000`);
      const body = await response.json();
      expect(body[0].description).toContain(`Bill Payment to`);
    })

  })

})
