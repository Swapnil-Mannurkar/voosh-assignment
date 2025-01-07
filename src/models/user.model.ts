import { Document, model, Schema } from "mongoose";
import { IUser } from "../utils/types/user";
import * as uuid from "uuid";

type IUserDoc = Document | IUser;

const UserSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true, default: uuid.v4() },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "EDITOR", "VIEWER"], required: true },
    tokenVersion: { type: Number, required: true, default: 0 },
    organisationId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = model<IUserDoc>("User", UserSchema);
export default User;
