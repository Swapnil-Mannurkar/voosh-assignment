import { Request, Response } from "express";
import { createResponse } from "../utils/helper/response-structure";
import {
  checkUserMissingField,
  checkUserPasswordMissingField,
} from "../utils/helper/missing-field";
import {
  ITokenUserDetails,
  IUser,
  IUserPasswordUpdate,
  IUserCreation,
} from "../utils/types/user";
import bcrypt from "bcryptjs";
import User from "../models/user.model";

export default class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 5;
      const offset = Number(req.query.offset) || 0;
      const role = req.query.role as string;
      const roles = ["admin", "editor", "viewer"];

      const adminDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );

      let users = (await User.find({
        organisationId: adminDetails.organisationId,
      })
        .skip(offset)
        .limit(limit)) as unknown as IUser[];

      if (role) {
        if (!roles.includes(role.toLowerCase())) {
          const response = createResponse(
            400,
            "Invalid role. Please choose from ADMIN, EDITOR, or VIEWER"
          );
          res.status(400).send(response);
          return;
        }

        users = users.filter(
          (user) => user.role.toLowerCase() === role.toLowerCase()
        );
      }

      const filteredUserDetails = users.map((user) => ({
        user_id: user._id,
        email: user.email,
        role: user.role.toUpperCase(),
        created_at: user.createdAt,
      }));

      const response = createResponse(
        200,
        "Users retrieved successfully",
        filteredUserDetails
      );
      res.status(200).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Error retrieving all users",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const adminDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const userDetails: IUserCreation = req.body;

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

      await User.create({
        ...userDetails,
        organisationId: adminDetails.organisationId,
        role: userDetails.role.toUpperCase() || "VIEWER",
        password: await bcrypt.hash(userDetails.password, 10),
      });

      const response = createResponse(201, "User created successfully");
      res.status(201).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Error creating user",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const userDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const passwordDetails: IUserPasswordUpdate = req.body;

      if (!passwordDetails.old_password || !passwordDetails.new_password) {
        const response = createResponse(
          400,
          checkUserPasswordMissingField(
            passwordDetails.old_password,
            passwordDetails.new_password
          )
        );
        res.status(400).send(response);
        return;
      }

      const user: IUser | null = await User.findById(userDetails.userId);

      if (!user) {
        const response = createResponse(404, "User not found");
        res.status(404).send(response);
        return;
      }

      const isMatch = await bcrypt.compare(
        passwordDetails.old_password,
        user.password
      );

      if (!isMatch) {
        const response = createResponse(
          403,
          "Forbidden Access/Operation not allowed. Incorrect password"
        );
        res.status(403).send(response);
        return;
      }

      if (passwordDetails.old_password === passwordDetails.new_password) {
        const response = createResponse(
          409,
          "New password cannot be same as the old one"
        );
        res.status(409).send(response);
        return;
      }

      await User.findByIdAndUpdate(userDetails.userId, {
        password: await bcrypt.hash(passwordDetails.new_password, 10),
      });

      res.status(204).send();
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Error updating password",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const adminDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const providedUserId = req.params.user_id as string;

      if (!providedUserId) {
        const response = createResponse(
          400,
          "Bad Request, Reason: Missing Field User ID"
        );
        res.status(400).send(response);
        return;
      }

      if (adminDetails.userId.toString() === providedUserId) {
        const response = createResponse(
          403,
          "Forbidden Access/Operation not allowed. Admin cannot be deleted"
        );
        res.status(403).send(response);
        return;
      }

      let dbUser: IUser;

      try {
        dbUser = (await User.findById(providedUserId)) as IUser;
      } catch (err: any) {
        const response = createResponse(404, "User not found");
        res.status(500).send(response);
        return;
      }

      if (!dbUser) {
        const response = createResponse(404, "User not found");
        res.status(404).send(response);
        return;
      }

      await User.findByIdAndDelete(providedUserId);

      const response = createResponse(200, "User deleted successfully");
      res.status(200).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to delete user",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }
}
