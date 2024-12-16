import {expect, Page} from "@playwright/test";
import * as homePageSelectors from "../selectors/homepage-selectors";
const payeeUserData = require('../data/payee-user-data.json');

const {
    ACCOUNT_OVERVIEW_LINK,
    ACCOUNT_TYPE,
    AMOUNT, BILL_PAY_LINK,
    CONFIRM_ACCOUNT_NUMBER,
    ENTER_AMOUNT,
    FUND_TRANSFER_LINK,
    GLOBAL_NAVIGATION_LINKS,
    NEW_ACCOUNT_CREATION_LINK,
    NEW_ACCOUNT_NUMBER_TEXT,
    OPEN_NEW_ACCOUNT_BUTTON,
    PAYEE_ACCOUNT_NUMBER,
    PAYEE_ADDRESS,
    PAYEE_CITY,
    PAYEE_NAME,
    PAYEE_PHONE_NUMBER,
    PAYEE_STATE,
    PAYEE_ZIP_CODE, SELECT_ACCOUNT_NUMBER, SELECT_ACCOUNT_TO_TRANSFER, SEND_PAYMENT_BUTTON,
    TRANSFER_AMOUNT_BUTTON
} = homePageSelectors;

export class HomePage {
    readonly page : Page;

    constructor(page : Page) {
        this.page = page;
    }

    async getGlobalNavigationLinks(){
        return await this.page.locator(GLOBAL_NAVIGATION_LINKS).all();
    }

    async getMinAmountToText(){
        const minAmountText =  await this.page.locator('[id="openAccountForm"] p').last().textContent();

        const replacedText = minAmountText.replace(',','');
        
        return replacedText.match(/\$\d+(?:\.\d{2})?/g)[0];

    }

    async goToNewAccountCreationPage(){
        const newAccountLink= this.page.locator(NEW_ACCOUNT_CREATION_LINK);
        await newAccountLink.click();
    }

    async createSavingsAccount(){
        await this.page.locator(ACCOUNT_TYPE).selectOption("SAVINGS");

        await this.page.waitForTimeout(1000);

        await this.page.locator(OPEN_NEW_ACCOUNT_BUTTON).click();
    }

    async getTheAccountNumber(){
        const account =  this.page.locator(NEW_ACCOUNT_NUMBER_TEXT);
        await account.waitFor({state:'visible'});

        return await account.textContent();
    }

    async goToAccountOverviewPage(){
        const accountOverViewLink = this.page.locator(ACCOUNT_OVERVIEW_LINK);
        await accountOverViewLink.click();
    }

    async goToFundTransferPage(){
        const fundTransferLink =  this.page.locator(FUND_TRANSFER_LINK);
        await fundTransferLink.click();
    }

    async transferFunds(accountNumber: string){
        await this.page.locator(ENTER_AMOUNT).fill('100');

        await this.page.locator(SELECT_ACCOUNT_TO_TRANSFER).selectOption(accountNumber);

        await this.page.locator(TRANSFER_AMOUNT_BUTTON).click();
    }

    async goToBillPayPage(){
        const billPayLink = this.page.locator(BILL_PAY_LINK);
        await billPayLink.waitFor({state:'visible'});
        await billPayLink.click();
    }

    async fillPayeeDetails(accountNumber : string, amount :string){
        await this.page.locator(PAYEE_NAME).fill(payeeUserData.payeeName);
        await this.page.locator(PAYEE_ADDRESS).fill(payeeUserData.payeeAddress);
        await this.page.locator(PAYEE_CITY).fill(payeeUserData.payeeCity);
        await this.page.locator(PAYEE_STATE).fill(payeeUserData.payeeCity);
        await this.page.locator(PAYEE_ZIP_CODE).fill(payeeUserData.payeeZipCode);
        await this.page.locator(PAYEE_PHONE_NUMBER).fill(payeeUserData.payeePhoneNumber);
        await this.page.locator(PAYEE_ACCOUNT_NUMBER).fill(payeeUserData.payeeAccountNumber);
        await this.page.locator(CONFIRM_ACCOUNT_NUMBER).fill(payeeUserData.confirmAccountNumber);
        await this.page.locator(AMOUNT).fill(amount);
        await this.page.locator(SELECT_ACCOUNT_NUMBER).selectOption(accountNumber);

        await this.page.waitForTimeout(2000);
    }

    async clickOnSendPayment(){
        const sendPayment = this.page.locator(SEND_PAYMENT_BUTTON);
        await sendPayment.waitFor({state:'visible'})
        await sendPayment.click();
    }


}
