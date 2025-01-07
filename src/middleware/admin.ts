import { NextFunction, Request, Response } from "express";
import { ITokenUserDetails } from "../utils/types/user";
import { createResponse } from "../utils/helper/response-structure";

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.headers.user as string;

    if (!user) {
      const response = createResponse(404, "User not found!");
      res.status(401).send(response);
      return;
    }

    const parsedUser: ITokenUserDetails = JSON.parse(user);

    if (parsedUser.role.toLowerCase() !== "admin") {
      const response = createResponse(
        401,
        "Forbidden Access/Operation not allowed."
      );
      res.status(401).send(response);
      return;
    }

    next();
  } catch (err) {
    throw err;
  }
};

export default verifyAdmin;
