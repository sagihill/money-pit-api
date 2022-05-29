import puppeteer from "puppeteer";
import * as path from "path";
import { FS, Sync } from "../../lib/common";
import { ExpenseSheetsTypes, Credentials, LoggerTypes } from "../../types";

type Page = puppeteer.Page;

export class ExpenseSheets implements ExpenseSheetsTypes.IExpenseSheets {
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
    } catch (error) {
      await this.logger.error(
        "Somthing happend while downloading expense sheets"
      );
      throw error;
    }
  }

  async initPage(): Promise<Page> {
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1920, height: 1080 },
    });
    const page = await browser.newPage();

    return page;
  }

  async login(page: Page, credentials: Credentials): Promise<void> {
    //Load login form
    const element = await page.waitForSelector(
      '[class="go-to-personal-area log-in-status d-none d-sm-none d-md-block ng-star-inserted"]'
    );

    await element?.click();
    await page.click("#login-password-link");

    // Fillout login form
    const usernameElement = await page.waitForSelector('[id="user-name"]');
    await usernameElement?.type(credentials.username);

    const passwordElement = await page.waitForSelector('[id="password"]');
    await passwordElement?.type(credentials.password);

    await Sync.sleep(1000);

    // Submit login form
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await page.waitForNavigation();
  }

  async downloadFiles(page: Page, accountId: string): Promise<void> {
    const goToDownloadPage = await page.waitForSelector(
      '[class="card card-box card-box-url ng-star-inserted"]'
    );
    await goToDownloadPage?.click();

    const downloadPath = path.join(
      __dirname,
      `${this.options.expenseSheetsPath}/processing/${accountId}`
    );

    FS.createDirIfNotExists(downloadPath);

    await page.client().send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath,
    });

    const downloadButton = await page.waitForSelector(
      '[class="download-excel"]',
      { timeout: 40000 }
    );
    await downloadButton?.click();
  }
}
