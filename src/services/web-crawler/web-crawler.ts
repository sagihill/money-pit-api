import puppeteer from "puppeteer";
import * as path from "path";
import { Async, Sync } from "../../lib/common";

export class WebCrawler {
  async login() {
    puppeteer.launch;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.max.co.il/homepage/welcome");
    const element = await page.$(
      '[class="go-to-personal-area log-in-status d-none d-sm-none d-md-block ng-star-inserted"]'
    );

    await element?.click();
    await page.click("#login-password-link");

    // Login
    const username = process.env.MAX_USERNAME as string;
    const password = process.env.MAX_PASSWORD as string;

    const usernameElement = await page.$('[id="user-name"]');
    await usernameElement?.type(username);

    const passwordElement = await page.$('[id="password"]');
    await passwordElement?.type(password);

    await Sync.sleep(3000);

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await Sync.sleep(3000);
    await page.screenshot({
      path: path.join(__dirname, `../../public/screenshots/img_03.png`),
    });

    const handle = await page.$(
      '[class="card card-box card-box-url ng-star-inserted"]'
    );
    await Sync.sleep(3000);

    await handle?.click();
    await Sync.sleep(3000);
    await page.screenshot({
      path: path.join(__dirname, `../../public/screenshots/img_05.png`),
    });
    await page.client().send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: path.join(__dirname, `../../public/expense-sheets`),
    });
    const handle2 = await page.$('[class="download-excel"]');
    await Sync.sleep(3000);
    await page.screenshot({
      path: path.join(__dirname, `../../public/screenshots/img_05.png`),
    });
    await handle2?.click();
    await Sync.sleep(3000);
    await page.screenshot({
      path: path.join(__dirname, `../../public/screenshots/img_06.png`),
    });
    await page.screenshot({
      path: path.join(__dirname, `../../public/screenshots/img_07.png`),
    });
  }
}
