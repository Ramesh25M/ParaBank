import type {Page} from '@playwright/test';
import {
    ADDRESS, CITY_NAME, CONFIRM_PASSWORD,
    FIRST_NAME,
    LAST_NAME, PASSWORD, PHONE_NUMBER,
    REGISTRATION_BUTTON,
    REGISTER_LINK, SSN_NUMBER, STATE_NAME, USER_NAME, ZIP_CODE,
    LOGIN_USERNAME,
    LOGIN_PASSWORD,
    LOGIN_BUTTON,
    LOGOUT_BUTTON
} from '../selectors/registration-locators';
const userData = require('../data/registration-data.json');

export class RegistrationPage{
    readonly page : Page;

    constructor(page:Page){
        this.page = page;
    }

    async clickOnRegisterLink(): Promise<void> {
        const registerLink = this.page.locator(REGISTER_LINK);
        await registerLink.click();
        const registrationButton = this.page.locator(REGISTRATION_BUTTON);
        await registrationButton.waitFor({state:'visible'});
    }

    getRandomUserName(user: string) {
       const randomNumber = Math.floor(Math.random() *1000);
       return user + randomNumber;
    }

    async fillRegistrationDetails(userName : string){
        await this.page.locator(FIRST_NAME).fill(userData.firstName);
        await this.page.locator(LAST_NAME).fill(userData.lastName);
        await this.page.locator(ADDRESS).fill(userData.address);
        await this.page.locator(CITY_NAME).fill(userData.cityName);
        await this.page.locator(STATE_NAME).fill(userData.stateName);
        await this.page.locator(ZIP_CODE).fill(userData.zipCode);
        await this.page.locator(PHONE_NUMBER).fill(userData.phoneNumber);
        await this.page.locator(SSN_NUMBER).fill(userData.ssnNumber);

        await this.page.locator(USER_NAME).fill(userName);
        await this.page.locator(PASSWORD).fill(userData.password);
        await this.page.locator(CONFIRM_PASSWORD).fill(userData.confirmPassword);
    }

    async submitRegistrationForm(){
        const registrationButton = this.page.locator(REGISTRATION_BUTTON);
        await registrationButton.waitFor({state:'visible'});
        await registrationButton.click();
    }

    async clickOnLogOut(){
        const logOutButton = this.page.locator(LOGOUT_BUTTON);
        await logOutButton.waitFor({state:'visible'});
        await logOutButton.click();
    }

    async logInWithUserName(userName : string){
        await this.page.locator(LOGIN_USERNAME).fill(userName);
        await this.page.locator(LOGIN_PASSWORD).fill(userData.password);

        await this.page.locator(LOGIN_BUTTON).click();
    }



}
