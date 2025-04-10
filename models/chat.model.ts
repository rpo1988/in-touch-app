import { UserModel } from "@/models/user.model";
import { IChat } from "@/types/global.types";
import mongoose, { Document, Model, Schema } from "mongoose";

type IChatModel = IChat & Document;

const chatSchema: Schema<IChatModel> = new Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserModel.modelName,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: UserModel.modelName,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const ChatModel: Model<IChatModel> = mongoose.model<IChatModel>(
  "Chat",
  chatSchema
);
