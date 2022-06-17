import * as path from "path";
import { FS, ID, Sync } from "../lib";
import { ServicesProvider } from "../services/services-provider";

export function IIFE(callback: Function) {
  (async () => {
    try {
      await callback();
    } catch (e) {
      console.log(e);
    }
  })();
}

IIFE(async () => {
  const name = process.argv.slice(2)[0];
  const SP = ServicesProvider.get();
  const logger = await SP.Logger();
  const options = {
    configMigrationFileTemplatePath: path.join(
      __dirname,
      `../services/migrate/templates/configMigration.ts`
    ),
    migrationsPath: path.join(__dirname, `../services/migrate/migrations`),
  };

  logger.info("Creating new migration file.");
  const fileName = `/${name}_${await ID.get()}`;

  const cleanFileName = fileName.replace(/\//, "").replace(/-/g, "_");

  const filePath = path.join(options.migrationsPath, fileName + ".ts");

  const created = FS.copyFile(
    options.configMigrationFileTemplatePath,
    filePath
  );

  if (created) {
    logger.info(`Please edit new file at: migrations${fileName}`);
    FS.replaceInFile(
      path.join(options.migrationsPath, "index.ts"),
      "//#import_here",
      `import * as ${cleanFileName} from ".${fileName.replace(
        /.ts/,
        ""
      )}"; \n//#import_here`
    );

    await Sync.sleep(100);

    FS.replaceInFile(
      path.join(options.migrationsPath, "index.ts"),
      "//#export_here",
      `${cleanFileName},\n//#export_here`
    );
  } else {
    logger.info(`Oops... something wen't wrong.`);
  }
});
