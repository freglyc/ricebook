const faker = require('faker');
const puppeteer = require('puppeteer');

const appUrlBase = 'https://cfregly-ricebook-frontend.surge.sh';
const routes = {
    public: {
        landing: `${appUrlBase}/`,
    },
    private: {
        home: `${appUrlBase}/home`,
        profile: `${appUrlBase}/profile`
    },
};

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}

let browser;
let page;

beforeAll(async () => {
    // launch browser
    browser = await puppeteer.launch(
        {
            viewport: {
                width: 1366,
                height: 768
            },
            headless: false, // headless mode set to false so browser opens up with visual feedback
            slowMo: 20, // how slow actions should be
        }
    );
    // creates a new page in the opened browser
    page = await browser.newPage()
});

describe('end to end', () => {

    const first = faker.name.firstName();
    const last = faker.name.lastName();

    const newUser = {
        first: first,
        last: last,
        username: first[0].toLowerCase() + last.toLowerCase(),
        email: first[0] + last + '@gmail.com',
        phone: '1111111111',
        zip: '11111',
        password: '123456'
    };

    test('user can register', async () => {
        await page.goto(routes.public.landing);
        await page.waitForSelector('#ricebook');

        await page.click('input[name=first]');
        await page.type('input[name=first]', newUser.first);
        await page.click('input[name=last]');
        await page.type('input[name=last]', newUser.last);
        await page.click('input[name=username]');
        await page.type('input[name=username]', newUser.username);
        await page.click('input[name=zip]');
        await page.type('input[name=zip]', newUser.zip);
        await page.click('input[name=email]');
        await page.type('input[name=email]', newUser.email);
        await page.click('input[name=phone]');
        await page.type('input[name=phone]', newUser.phone);
        await page.select('#birthMonth', 'May');
        await page.select('#birthDay', '03');
        await page.select('#birthYear', '1990');
        await page.click('input[name=password]');
        await page.type('input[name=password]', newUser.password);
        await page.click('input[name=confirm]');
        await page.type('input[name=confirm]', newUser.password);
        await page.click('input[id=register-btn]');

        await delay(3000);

        const msg = await page.$eval('#register-error', e => e.innerHTML);
        expect(msg).toBe('Registration successful. Please login.');
    }, 150000);

    test('user can login', async () => {
        await page.click('input[id=username]');
        await page.type('input[id=username]', newUser.username);
        await page.click('input[id=password]');
        await page.type('input[id=password]', newUser.password);
        await page.click('button[id=login-btn]');
        await page.waitForSelector('#status');
    }, 150000);

    test('user can create an article and see it in feed', async () => {
        const title = faker.random.words();
        const body = faker.random.words();
        const numArticles = await page.evaluate(() => document.getElementsByName('article').length);

        await page.click('input[id=new-post-title]');
        await page.type('input[id=new-post-title]', title);
        await page.click('textarea[id=new-post-body]');
        await page.type('textarea[id=new-post-body]', body);
        await page.click('input[id=new-post-post-btn]');

        await delay(1000);

        const newNumArticles = await page.evaluate(() => document.getElementsByName('article').length);
        expect(newNumArticles).toBe(numArticles + 1);
    }, 150000);

    test('user can update status and verify change', async () => {
        const status = 'new status';

        await page.click('input[id=new-status]');
        await page.type('input[id=new-status]', status);
        await page.keyboard.press('Enter');

        await delay(1000);

        const newStatus = await page.$eval('p[data-name=status]', e => e.innerHTML);
        expect(newStatus).toBe(status);
    }, 150000);

    test('user can logout', async () => {
        await page.click('button[name=logout]');
        await page.waitForSelector('#ricebook');
    }, 150000);

    test('test user can login', async () => {
        const testUser = {
            username: 'cdf7',
            password: '123'
        };
        await page.click('input[id=username]');
        await page.type('input[id=username]', testUser.username);
        await page.click('input[id=password]');
        await page.type('input[id=password]', testUser.password);
        await page.click('button[id=login-btn]');
        await page.waitForSelector('#status');
    }, 150000);

    test('test user can search for keyword that matches 1 article, verify it is the only one to show and correct author', async () => {
        await page.click('input[id=search-field]');
        await page.type('input[id=search-field]', 'qwertyuiop');
        await page.keyboard.press('Enter');

        await delay(2000);

        const numArticles = await page.evaluate(() => document.getElementsByName('article').length);
        expect(numArticles).toBe(1);
    }, 150000);

    test('test user can logout', async () => {
        await page.click('button[name=logout]');
        await page.waitForSelector('#ricebook');
        browser.close();
    }, 150000);
});