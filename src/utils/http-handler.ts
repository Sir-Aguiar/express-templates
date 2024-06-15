import { Response } from "express";
import { ProcessError } from "../entity/errors/ProcessError";

type KnownServerErrors = ProcessError | Error;

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

    return this.response.status(500).json({});
  }
}
