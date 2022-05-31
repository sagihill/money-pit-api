import * as fs from "fs";

export namespace FS {
  export function createDirIfNotExists(dirPath: fs.PathLike): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  export function removeDirOrFile(path: fs.PathLike): void {
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
    } catch (error) {}
  }

  export function countNumOfFiles(path: fs.PathLike): number {
    try {
      const files = fs.readdirSync(path);
      return files.length;
    } catch (error) {
      return 0;
    }
  }
}
