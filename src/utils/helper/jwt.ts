import jwt from "jsonwebtoken";
import { ITokenUserDetails, IUserResponse } from "../types/user";
import User from "../../models/user.model";

export const generateToken = (userDetails: ITokenUserDetails) => {
  try {
    const jwtSecret = process.env.JWT_SECRET as string;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable not found.");
    }

    return jwt.sign(userDetails, jwtSecret, { expiresIn: "2h" });
  } catch (err) {
    throw err;
  }
};

export const verifyToken = async (token: string) => {
  try {
    const jwtSecret = process.env.JWT_SECRET as string;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable not found.");
    }

    const user = jwt.verify(token, jwtSecret) as ITokenUserDetails;

    if (!user) {
      throw new Error("user not found!");
    }

    const dbUser = (await User.findOne({ email: user.email })) as IUserResponse;

    if (dbUser.tokenVersion !== user.tokenVersion) {
      throw new Error("Invalid token!");
    }

    return JSON.stringify(user);
  } catch (err) {
    throw err;
  }
};
