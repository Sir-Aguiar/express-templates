import "dotenv/config";
import CryptoJS from "crypto-js";

import { ProcessError } from "../entity/errors/ProcessError";

export class CryptographyService {
  private PRIVATE_KEY: string;

  constructor() {
    if (!process.env.PRIVATE_KEY) {
      throw new ProcessError(500, "Não é possível realizara a criptografia sem uma chave privada");
    }

    this.PRIVATE_KEY = process.env.PRIVATE_KEY;
  }

  public encryptText(data: string): string {
    if (typeof data !== "string") {
      throw new ProcessError(500, "Não é possível criptografar um texto que não seja do tipo string");
    }

    return CryptoJS.AES.encrypt(data, this.PRIVATE_KEY).toString();
  }

  public encryptObject(data: object): string {
    if (typeof data !== "object") {
      throw new ProcessError(500, "Não é possível criptografar um objeto que não seja do tipo object");
    }

    return CryptoJS.AES.encrypt(JSON.stringify(data), this.PRIVATE_KEY).toString();
  }

  public decrypt<T = string>(data: string): T {
    if (typeof data !== "string") {
      throw new ProcessError(500, "Não é possível descriptografar um texto que não seja do tipo string");
    }

    const bytes = CryptoJS.AES.decrypt(data, this.PRIVATE_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    try {
      return JSON.parse(originalText);
    } catch (error) {
      return originalText as unknown as T;
    }
  }
}
