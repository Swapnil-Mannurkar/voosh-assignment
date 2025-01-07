import { ObjectId } from "mongodb";

export interface IUser {
  userId: string;
  email: string;
  password: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  tokenVersion: number;
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse extends IUser {
  _id: ObjectId;
  __v: number;
}

export interface ITokenUserDetails {
  userId: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  organisationId: string;
  tokenVersion: number;
}

export interface IUserSignup {
  email: string;
  password: string;
  organisation: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
}

export interface IUserPasswordUpdate {
  old_password: string;
  new_password: string;
}
