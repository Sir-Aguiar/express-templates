import "dotenv/config";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { ProcessError } from "../entity/errors/ProcessError";

export interface IPasswordService {
  hashPassword(password: string): string;
  comparePassword(password: string, hashedPassword: string): boolean;
}

export class PasswordService implements IPasswordService {
  private SALT: number;

  constructor() {
    if (!process.env.SALT || isNaN(Number(process.env.SALT))) {
      throw new ProcessError(500, "Não é possível realizar a criptografia da senha sem um valor de salto");
    }

    this.SALT = Number(process.env.SALT);
  }

  public hashPassword(password: string): string {
    const salt = genSaltSync(this.SALT);
    return hashSync(password, salt);
  }

  public comparePassword(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
  }
}
