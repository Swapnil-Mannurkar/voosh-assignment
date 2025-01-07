import { NextFunction, Request, Response } from "express";
import { createResponse } from "../utils/helper/response-structure";
import { verifyToken } from "../utils/helper/jwt";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      const response = createResponse(400, "No token provided");
      res.status(401).send(response);
      return;
    }

    const user = await verifyToken(token);

    req.headers["user"] = user;

    next();
  } catch (error: any) {
    const response = createResponse(
      500,
      "An error occurred while authenticating user",
      null,
      error.message
    );
    res.status(500).send(response);
  }
};
