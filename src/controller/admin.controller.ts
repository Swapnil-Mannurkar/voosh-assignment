import { Request, Response } from "express";
import User from "../models/user.model";
import { IAdminSignup } from "../utils/types/admin";
import { createResponse } from "../utils/helper/response-structure";
import Organisation from "../models/organisation.model";
import bcrypt from "bcryptjs";

export default class AdminController {
  async createAdmin(req: Request, res: Response) {
    try {
      const userDetails: IAdminSignup = req.body;

      if (!userDetails.email || !userDetails.password) {
        const response = createResponse(
          400,
          `Bad Request, Reason: Missing Field ${
            !userDetails.email && !userDetails.password
              ? "Email and Password"
              : userDetails.email && !userDetails.password
                ? "Password"
                : "Email"
          }`
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
}
