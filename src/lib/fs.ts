import * as fs from "fs";

export namespace FS {
  export function createDirIfNotExists(dirPath: fs.PathLike): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  export function copyFile(
    srcPath: fs.PathLike,
    newPath: fs.PathLike
  ): boolean {

    if (!fs.existsSync(newPath)) {
      try {
        fs.copyFileSync(srcPath, newPath);
      } catch (error) {
        console.log(error);
        return false;
      }
      return true;
    }
    return false;
  }

  export function replaceInFile(
    filePath: fs.PathLike,
    toReplace: string,
    replacement: string
  ) {
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }

      const regex = new RegExp(toReplace);
      const result = data.replace(regex, replacement);

      fs.writeFile(filePath, result, "utf8", function (err) {
        if (err) return console.log(err);
      });
    });
  }

  export function deletedirOrFile(path: fs.PathLike): void {
    if (fs.existsSync(path)) {
      fs.rmSync(path, { recursive: true });
    } else {
      console.log("File or directory doesn't exists.");
    }
  }

  export function clearDir(path: fs.PathLike): void {
    if (fs.existsSync(path)) {
      const files = fs.readdirSync(path);
      files.forEach((file) => {
        fs.rmSync(path + `/${file}`);
      });
    } else {
      console.log("Directory doesn't exists.");
    }
  }

  export function isDirEmpty(path: fs.PathLike): boolean {
    const files = fs.readdirSync(path);
    return !files.length;
  }

  export function move(org: fs.PathLike, dest: fs.PathLike): void {
    try {
      fs.renameSync(org, dest);
    } catch (error: any) {}
  }

  export function countNumOfFiles(path: fs.PathLike): number {
    try {
      const files = fs.readdirSync(path);
      return files.length;
    } catch (error: any) {
      return 0;
    }
  }
}
