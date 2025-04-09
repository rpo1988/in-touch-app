import { ContactModel } from "@/models/contact.model";
import { IChat } from "@/types/global.types";
import mongoose, { Document, Model, Schema } from "mongoose";

type IChatModel = IChat & Document;

const chatSchema: Schema<IChatModel> = new Schema(
  {
    sourceContact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ContactModel.modelName,
      required: true,
    },
    targetContact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ContactModel.modelName,
      required: true,
    },
  },
  { timestamps: true }
);

export const ChatModel: Model<IChatModel> = mongoose.model<IChatModel>(
  "Chat",
  chatSchema
);
