import * as crypto from "crypto";
import { CryptoTypes } from "../../types";

export class CryptoService implements CryptoTypes.ICryptoService {
  private cipher: crypto.Cipher;
  private decipher: crypto.Decipher;
  private iv: Buffer;

  constructor(secretKey: string) {
    this.iv = crypto.randomBytes(16);
    const key = crypto
      .createHash("sha256")
      .update(String(secretKey))
      .digest("base64")
      .substr(0, 32);

    this.cipher = crypto.createCipheriv("aes-256-ctr", key, this.iv);
    this.decipher = crypto.createDecipheriv("aes-256-ctr", key, this.iv);
  }

  async encrypt(string: string): Promise<string> {
    const encrypted = Buffer.concat([
      this.cipher.update(string),
      this.cipher.final(),
    ]);
    return encrypted.toString("hex");
  }

  async decrypt(string: string): Promise<string> {
    const decrpyted = Buffer.concat([
      this.decipher.update(Buffer.from(string, "hex")),
      this.decipher.final(),
    ]);

    return decrpyted.toString();
  }
}
