import express from "express";
import cors from "cors";
import { createServer } from "http";
import routes from "./router";

const ExpressApp = express();

const HTTP_SERVER = createServer(ExpressApp);

ExpressApp.use(cors({ origin: "*", preflightContinue: true }));
ExpressApp.use(express.json());
ExpressApp.use(routes);

export { HTTP_SERVER };
