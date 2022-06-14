export namespace CryptoTypes {
  export interface ICryptoService {
    encrypt(string: string): Promise<string>;
    decrypt(string: string): Promise<string>;
  }
}
