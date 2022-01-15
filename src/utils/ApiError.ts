import { isCelebrateError } from "celebrate";
import { NextFunction, Request, Response } from "express";
import { Status } from "./Status";

export class ApiError extends Error {
  statusCode;
  message;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Requested resource not found!`));
};

export const handleError = (err: any, res: Response) => {
  let statusCode: number;
  if (err.response?.status) statusCode = err.response.status;
  else statusCode = err.statusCode || 500;

  // also catch google api error
  const message = err?.response?.statusText || err.message;

  // handle celebrate errors
  if (isCelebrateError(err)) {
    const errorBody = err.details.get("body");
    statusCode = 400;
    const result = {
      status: Status.ERROR,
      statusCode,
      message: errorBody?.details[0].message,
    };

    return res.json(result);
  }

  res.status(statusCode);

  if (process.env.NODE_ENV === "production") {
    res.json({
      status: Status.ERROR,
      statusCode,
      message,
    });
  } else {
    res.json({
      status: Status.ERROR,
      statusCode,
      message,
      stack: err.stack,
    });
  }
};
