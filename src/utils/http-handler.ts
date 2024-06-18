import { Response } from "express";
import { ProcessError } from "../entity/errors/ProcessError";
import { ZodError } from "zod";

type KnownServerErrors = ProcessError | ZodError | Error;

export class HTTPHandler {
  constructor(private response: Response) {}

  public success(body?: any, status = 200) {
    return this.response.status(status).json(body || {});
  }

  public clientError(message: string) {
    return this.response.status(400).json({ error: { message } });
  }

  public notFound(message: string) {
    return this.response.status(404).json({ error: { message } });
  }

  public unauthorized(message: string) {
    return this.response.status(401).json({ error: { message } });
  }

  public forbidden(message: string) {
    return this.response.status(403).json({ error: { message } });
  }

  public knownError(error: KnownServerErrors) {
    if (error instanceof ProcessError) {
      const { code, message } = error;

      return this.response.status(code).json({ error: { message } });
    }

    if (error instanceof ZodError) {
      const { errors } = error;
      let message = errors[0].message || "Houve um erro desconhecido na hora de validar os dados inseridos";

      switch (errors[0].code) {
        case "invalid_type":
          message = `O campo de '${errors[0].path[0]}' está em formato inválido`;
          break;
        case "invalid_date" || "invalid_string":
          message = `O campo de '${errors[0].path[0]}' está em formato inválido`;
          break;
        case "too_big":
          if (errors[0].type === "string") {
            message = `O campo de '${errors[0].path[0]}' precisa ter no máximo ${errors[0].maximum} caracteres`;
          }
          break;
        case "too_small":
          if (errors[0].type === "string") {
            message = `O campo de '${errors[0].path[0]}' precisa ter no mínimo ${errors[0].minimum} caracteres`;
          }
          break;
        default:
          break;
      }

      return this.response.status(400).json({ error: { message } });
    }

    return this.response.status(500).json({});
  }

  public unkownError() {
    return this.response.status(500).json({});
  }
}
