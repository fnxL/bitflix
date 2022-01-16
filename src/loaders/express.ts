import cors from "cors";
import dependencyInjectors from "./dependencyInjectors";
dependencyInjectors();
import express, { NextFunction, Request, Response } from "express";
require("express-async-errors");
import { handleError, notFound } from "../utils/ApiError";
import routes from "../routes";
import logger from "../utils/logger";
import cookieParser from "cookie-parser";

const app = express();

// Logging service
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(req.method + " " + req.originalUrl);
  next();
});

app.use(cookieParser());

app.disable("x-powered-by");

// Enable Cross Origin Resource Sharing to all origins by default
app.use(
  cors({
    credentials: true,
    origin: ["*"],
  })
);

app.use(express.json());

/**
 * Health Check endpoints
 * @TODO Explain why they are here
 */
app.get("/status", (req: Request, res: Response) => {
  res.status(200).end();
});

/* Application Routes */
app.use(routes);

// catch 404 and
app.use(notFound);

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  handleError(err, res);
});

export default app;
