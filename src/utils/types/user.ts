import { ObjectId } from "mongodb";

export interface IUserModel {
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  organisationId: ObjectId;
  password: string;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends ITokenUserDetails {
  _id: ObjectId;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ITokenUserDetails {
  userId: ObjectId;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  organisationId: ObjectId;
  tokenVersion: number;
}

export interface IUserCreation {
  email: string;
  password: string;
  organisation: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
}

export interface IUserPasswordUpdate {
  old_password: string;
  new_password: string;
}

export interface IUserQuery {
  organisationId: ObjectId;
  role?: string;
}
