import puppeteer from "puppeteer";
import * as path from "path";
import { FS, Sync } from "../../lib";
import { ExpenseSheetsTypes, Credentials, LoggerTypes } from "../../types";

type Page = puppeteer.Page;
type Browser = puppeteer.Browser;

export class ExpenseSheets implements ExpenseSheetsTypes.IExpenseSheets {
  private browser: Browser | undefined;

  constructor(
    private readonly options: ExpenseSheetsTypes.ExpenseSheetsOptions,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async run(params: ExpenseSheetsTypes.ExpesnseSheetsParams): Promise<void> {
    await this.logger.info("Downloading expense sheets");
    try {
      const page = await this.initPage();
      await page.goto(params.creditProviderWebsiteUrl);
      await this.login(page, params.credentials);
      await this.downloadFiles(page, params.accountId);
      await this.logout(page);
      await this.close(page);
    } catch (error) {
      await this.logger.error(
        "Somthing happend while downloading expense sheets"
      );
      throw error;
    }
  }

  async initPage(): Promise<Page> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 1080 },
      });
    }
    const page = await this.browser.newPage();
    return page;
  }

  async login(page: Page, credentials: Credentials): Promise<void> {
    //Load login form
    const element = await page.waitForSelector(
      '[class="go-to-personal-area log-in-status d-none d-sm-none d-md-block ng-star-inserted"]'
    );

    await element?.click();
    await page.click("#login-password-link");
    // await page.waitForNavigation();

    // Fillout login form
    const usernameElement = await page.waitForSelector('[id="user-name"]');
    await usernameElement?.type(credentials.username);

    const passwordElement = await page.waitForSelector('[id="password"]');
    await passwordElement?.type(credentials.password);

    await Sync.sleep(1000);

    // Submit login form
    const submitElement = await page.waitForXPath(
      "//span[contains(., 'לכניסה לאזור האישי')]"
    );

    await submitElement?.click();

    await page.waitForNavigation();

    await Sync.sleep(1000);
  }

  async downloadFiles(page: Page, accountId: string): Promise<void> {
    await Sync.sleep(1000);
    const downloadPath = path.join(
      __dirname,
      `${this.options.expenseSheetsPath}/processing/${accountId}`
    );

    const numberOfFiles = FS.countNumOfFiles(downloadPath);

    try {
      const closeButton = await page.waitForXPath(
        "//a[contains(., 'תודה, לא עכשיו')]",
        {
          timeout: 3000,
        }
      );
      // <a _ngcontent-my-app-id-c104="" title="" class="link">תודה, לא עכשיו</a>
      await closeButton?.click();
    } catch (error) {
      this.logger.info("didnt find close button");
    }

    await Sync.sleep(2000);

    const goToDownloadPage = await page.waitForXPath(
      "//li[@class='ng-tns-c84-1 ng-star-inserted']/a[contains(., 'פירוט חיובים')]",
      { timeout: 3000 }
    );

    await goToDownloadPage?.click();

    FS.createDirIfNotExists(downloadPath);

    await page.client().send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath,
    });

    const downloadButton = await page.waitForSelector(
      '[class="download-excel"]'
    );

    await downloadButton?.click();
    let currentNumberOfFiles = numberOfFiles;
    while (currentNumberOfFiles === numberOfFiles) {
      this.logger.info("Waiting for download...");
      currentNumberOfFiles = FS.countNumOfFiles(downloadPath);
    }

    return;
  }

  async close(page: Page): Promise<void> {
    await page.close();
    await this.browser?.close();
    this.browser = undefined;
  }

  async logout(page: Page): Promise<void> {
    const personalAreaButton = await page.waitForXPath(
      "//div[@class='go-to-personal-area log-in-status d-none d-sm-none d-md-block']"
    );
    await personalAreaButton?.click();
    await Sync.sleep(1000);
    const logout = await page.waitForXPath(
      "//div[@class='change-account']/a[contains(., 'התנתק')]"
    );
    await logout?.click();
    await Sync.sleep(1000);
  }

  // private async screenshot(name: string, page: puppeteer.Page) {
  //   await page.screenshot({
  //     path: path.join(__dirname, `../../public/screenshots/${name}.jpeg`),
  //   });
  // }
}
