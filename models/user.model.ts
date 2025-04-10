import { IUser } from "@/types/global.types";
import mongoose, { Document, Model, Schema } from "mongoose";

type IUserModel = IUser & Document;

const userSchema: Schema<IUserModel> = new Schema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    statusInfo: { type: String, default: "" },
  },
  { timestamps: true }
);

export const UserModel: Model<IUserModel> = mongoose.model<IUserModel>(
  "User",
  userSchema
);
