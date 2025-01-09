import { Document, model, Schema } from "mongoose";
import { IUserModel } from "../utils/types/user";

type IUserDoc = Document | IUserModel;

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    organisationId: {
      type: Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "EDITOR", "VIEWER"], required: true },
    tokenVersion: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const User = model<IUserDoc>("User", UserSchema);
export default User;
