import * as crypto from "crypto";
import { CryptoTypes } from "../../types";

export class CryptoService implements CryptoTypes.ICryptoService {
  private key: string;

  constructor(secretKey: string) {
    this.key = crypto
      .createHash("sha256")
      .update(String(secretKey))
      .digest("base64")
      .substring(0, 32);
  }

  async encrypt(string: string): Promise<string> {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-ctr", this.key, iv);
    const encrypted = Buffer.concat([cipher.update(string), cipher.final()]);
    return `${encrypted.toString("hex")}__${iv.toString("hex")}`;
  }

  async decrypt(string: string): Promise<string> {
    const [hash, iv] = string.split("__");
    const decipher = crypto.createDecipheriv(
      "aes-256-ctr",
      this.key,
      Buffer.from(iv, "hex")
    );

    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(hash, "hex")),
      decipher.final(),
    ]);

    return decrpyted.toString();
  }
}
