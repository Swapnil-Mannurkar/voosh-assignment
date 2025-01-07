import { Request, Response } from "express";
import User from "../models/user.model";
import { IAdminSignup } from "../utils/types/admin";
import { createResponse } from "../utils/helper/response-structure";
import Organisation from "../models/organisation.model";
import bcrypt from "bcryptjs";
import { ITokenUserDetails, IUserResponse } from "../utils/types/user";
import { checkUserMissingField } from "../utils/helper/missing-field";
import { generateToken } from "../utils/helper/jwt";

export default class AdminController {
  async createAdmin(req: Request, res: Response) {
    try {
      const userDetails: IAdminSignup = req.body;

      if (!userDetails.email || !userDetails.password) {
        const response = createResponse(
          400,
          checkUserMissingField(userDetails.email, userDetails.password)
        );
        res.status(400).send(response);
        return;
      }

      const existingUser = await User.findOne({ email: userDetails.email });
      if (existingUser) {
        const response = createResponse(409, "Email already exists");
        res.status(409).send(response);
        return;
      }

      if (!userDetails.organisation) {
        userDetails.organisation = "Default organisation";
      }

      let existingOrganisation = await Organisation.findOne({
        name: userDetails.organisation,
      });

      if (
        existingOrganisation &&
        userDetails.organisation !== "Default organisation"
      ) {
        userDetails.role = "VIEWER";
      }

      if (!existingOrganisation) {
        existingOrganisation = await Organisation.create({
          name: userDetails.organisation,
        });
        userDetails.role = "ADMIN";
      }

      userDetails.password = await bcrypt.hash(userDetails.password, 10);

      await User.create({
        ...userDetails,
        organisationId: existingOrganisation._id,
      });

      const response = createResponse(201, "User created successfully");
      res.status(201).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        400,
        "User creation failed",
        null,
        error.message
      );
      res.status(400).send(response);
      return;
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        const response = createResponse(
          400,
          checkUserMissingField(email, password)
        );
        res.status(400).send(response);
        return;
      }

      const user = (await User.findOne({ email })) as IUserResponse;
      if (!user) {
        const response = createResponse(404, "User not found");
        res.status(404).send(response);
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        const response = createResponse(401, "Incorrect password");
        res.status(401).send(response);
        return;
      }

      const token = generateToken({
        email: user.email,
        organisationId: user.organisationId,
        role: user.role,
        userId: user.userId,
        tokenVersion: user.tokenVersion,
      });

      const response = createResponse(
        200,
        "User logged in successfully",
        token
      );
      res.status(200).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        400,
        "User login failed",
        null,
        error.message
      );
      res.status(400).send(response);
      return;
    }
  }

  async logoutUser(req: Request, res: Response) {
    try {
      const user: ITokenUserDetails = JSON.parse(req.headers.user as string);

      await User.updateOne({ tokenVersion: user.tokenVersion + 1 });

      const response = createResponse(200, "User logged out successfully");
      res.status(200).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        400,
        "Failed to log out user",
        null,
        error.message
      );
      res.status(400).send(response);
      return;
    }
  }
}
