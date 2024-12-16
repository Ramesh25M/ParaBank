import {test, expect} from '@playwright/test';
import { RegistrationPage } from '../pages/registration-page';
import {HomePage} from "../pages/home-page";
import {ACCOUNT_OPEN_RESULT, ACCOUNT_OVERVIEW_TABLE, BALANCE_DETAILS, BILL_PAY_RESULT, FUND_TRANSFER_RESULT} from "../selectors/homepage-selectors";
import {ACCOUNT_CREATION_TEXT, ACCOUNT_OVERVIEW, RIGHT_PANEL} from "../selectors/registration-locators";

test.describe('Para Bank test suite', ()=>{
  let homePage: HomePage;
  let registrationPage: RegistrationPage;
  let userName:string;

  test.beforeEach('register new user', async ({page})=>{
    await page.goto('/');
    registrationPage = new RegistrationPage(page);
    homePage = new HomePage(page);

    await registrationPage.clickOnRegisterLink();
    userName = registrationPage.getRandomUserName("ParaUser");
    await registrationPage.fillRegistrationDetails(userName);
    await registrationPage.submitRegistrationForm();

    await expect.soft(page.locator(RIGHT_PANEL)).toContainText(ACCOUNT_CREATION_TEXT);
  })

  test('log in with new user', async({page}) => {
      await registrationPage.clickOnLogOut();
      await registrationPage.logInWithUserName(userName);

      await expect.soft(page.locator(ACCOUNT_OVERVIEW)).toContainText('Accounts Overview');
  })

  test('Global Navigation links check', async({page}) => {
    const baseUrl = 'https://parabank.parasoft.com/parabank/';
    const globalLinks = await homePage.getGlobalNavigationLinks();

    for(const globalLink of globalLinks){
      const href = await globalLink.getAttribute('href');
      const response = await page.request.get(baseUrl + href);
      await expect.soft(response).toBeOK();
  }
  });

  test('Banking operations test', async({page}) => {
    let newAccountNumber:string;
    const amount  = '300';
    let minAmount:string;

    await test.step('create new savings account', async ()=>{
      await homePage.goToNewAccountCreationPage();
      minAmount = await homePage.getMinAmountToText();
      await homePage.createSavingsAccount();

      expect.soft(page.locator(ACCOUNT_OPEN_RESULT)).toContainText('Account Opened!')

      newAccountNumber = await homePage.getTheAccountNumber();
    })

    await test.step('Account overview - balance detail check', async ()=>{
      await homePage.goToAccountOverviewPage();
      await page.locator(ACCOUNT_OVERVIEW_TABLE).waitFor({state:'visible'});

      const balanceDetails = await page.locator(BALANCE_DETAILS).all();

      expect.soft(await balanceDetails[0].textContent()).toContain(newAccountNumber);
      expect.soft(await balanceDetails[1].textContent()).toBe(minAmount);
      expect.soft(await balanceDetails[2].textContent()).toBe(minAmount);
    });

    await test.step('fund transfer to new savings account', async ()=>{
      await homePage.goToFundTransferPage();
      await homePage.transferFunds(newAccountNumber);

      const transferred = page.locator(FUND_TRANSFER_RESULT);
      await expect.soft(transferred).toContainText('Transfer Complete!');
    });

    await test.step('pay bill with new account', async ()=>{
      await homePage.goToBillPayPage();
      await homePage.fillPayeeDetails(newAccountNumber, amount);

      await homePage.clickOnSendPayment();
      await expect.soft(page.locator(BILL_PAY_RESULT)).toBeVisible();

    })

    await test.step('find the bill pay transaction', async ()=>{
      const response = await page.request.get(`https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${newAccountNumber}/transactions/amount/${amount}?timeout=30000`);
      const body = await response.json();
      expect.soft(body[0].description).toContain(`Bill Payment to`);
    })

  })

})
