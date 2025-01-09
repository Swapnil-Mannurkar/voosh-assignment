import jwt from "jsonwebtoken";
import { ITokenUserDetails, IUser } from "../types/user";
import User from "../../models/user.model";

export const generateToken = (userDetails: ITokenUserDetails) => {
  try {
    const jwtSecret = process.env.JWT_SECRET as string;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable not found.");
    }

    return jwt.sign(userDetails, jwtSecret, { expiresIn: 60 * 60 * 24 * 2 });
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
      throw new Error("Invalid token!");
    }

    const dbUser: IUser | null = await User.findOne({ email: user.email });

    if (!dbUser) {
      throw new Error("User not found!");
    }

    if (dbUser.tokenVersion !== user.tokenVersion) {
      throw new Error("Invalid token!");
    }

    return JSON.stringify(user);
  } catch (err) {
    throw err;
  }
};
