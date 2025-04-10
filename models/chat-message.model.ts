import { ChatModel } from "@/models/chat.model";
import { UserModel } from "@/models/user.model";
import { IChatMessage } from "@/types/global.types";
import mongoose, { Document, Model, Schema } from "mongoose";

type IChatMessageModel = IChatMessage & Document;

const chatMessageSchema: Schema<IChatMessageModel> = new Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ChatModel.modelName,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserModel.modelName,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ChatMessageModel: Model<IChatMessageModel> =
  mongoose.model<IChatMessageModel>("ChatMessage", chatMessageSchema);
