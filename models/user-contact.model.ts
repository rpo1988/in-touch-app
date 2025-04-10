import { UserModel } from "@/models/user.model";
import { IUserContact } from "@/types/global.types";
import mongoose, { Document, Model, Schema } from "mongoose";

type IUserContactModel = IUserContact & Document;

const userContactSchema: Schema<IUserContactModel> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserModel.modelName,
      required: true,
      unique: true,
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: UserModel.modelName,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const UserContactModel: Model<IUserContactModel> =
  mongoose.model<IUserContactModel>("UserContact", userContactSchema);
