import {expect, Page} from "@playwright/test";
import {
    AMOUNT, BILL_PAY_LINK,
    CONFIRM_ACCOUNT_NUMBER,
    PAYEE_ACCOUNT_NUMBER,
    PAYEE_ADDRESS,
    PAYEE_CITY,
    PAYEE_NAME,
    PAYEE_PHONE_NUMBER,
    PAYEE_STATE,
    PAYEE_ZIP_CODE, SELECT_ACCOUNT_NUMBER, SEND_PAYMENT_BUTTON
} from "../selectors/homepage-selectors";
const payeeUserData = require('../data/payee-user-data.json');

export class HomePage {
    readonly page : Page;

    constructor(page : Page) {
        this.page = page;
    }

    async verifyGlobalNavigationLinks(baseUrl: string){
        const globalLinks = await this.page.locator('#leftPanel ul a').all();
        for(const globalLink of globalLinks){
            const href = await globalLink.getAttribute('href');
            const url = baseUrl + href;
            const response = await this.page.request.get(url);
            await expect(response).toBeOK();
        }
    }

    async goToNewAccountCreationPage(){
        const newAccountLink= this.page.locator('a[href="openaccount.htm"]');
        await newAccountLink.click();
    }

    async createSavingsAccount(){
        await this.page.locator('select[id="type"]').selectOption("SAVINGS");

        await this.page.waitForTimeout(1000);

        await this.page.locator('input[value="Open New Account"]').click();
    }

    async getTheAccountNumber(){
        const account =  this.page.locator('a[id="newAccountId"]');
        await account.waitFor({state:'visible'});

        return await account.textContent();
    }

    async goToAccountOverviewPage(){
        const accountOverViewLink = this.page.locator('a[href="overview.htm"]');
        await accountOverViewLink.click();
    }

    async goToFundTransferPage(){
        const fundTransferLink =  this.page.locator('a[href="transfer.htm"]');
        await fundTransferLink.click();
    }

    async transferFunds(accountNumber: string){
        await this.page.locator('input[id="amount"]').fill('100');

        await this.page.locator('select[id="toAccountId"]').selectOption(accountNumber);

        await this.page.locator('input[value="Transfer"]').click();
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
