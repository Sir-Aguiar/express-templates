import { NextFunction, Request, RequestHandler, Response } from "express";
import { HTTPHandler } from "../utils/http-handler";
import { ProcessError } from "./errors/ProcessError";
import { ZodError } from "zod";

export abstract class BaseController {
  protected HttpHandler: HTTPHandler;

  constructor(protected request: Request, protected response: Response, protected next: NextFunction) {
    this.HttpHandler = new HTTPHandler(response);
  }

  abstract requestHandler(): Promise<any>;

  protected async handleError(error: any): Promise<any> {
    if (error instanceof ProcessError || error instanceof ZodError) {
      return this.HttpHandler.knownError(error);
    }

    return this.HttpHandler.unkownError();
  }

  public async handleRequest(): Promise<any> {
    try {
      return await this.requestHandler();
    } catch (error) {
      return this.handleError(error);
    }
  }
}
