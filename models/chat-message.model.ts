import { ChatModel } from "@/models/chat.model";
import { ContactModel } from "@/models/contact.model";
import { IChatMessage } from "@/types/global.types";
import mongoose, { Document, Model, Schema } from "mongoose";

type IChatMessageModel = IChatMessage & Document;

const chatMessageSchema: Schema<IChatMessageModel> = new Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ChatModel.modelName,
    required: true,
  },
  sourceContact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ContactModel.modelName,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

export const ChatMessageModel: Model<IChatMessageModel> =
  mongoose.model<IChatMessageModel>("ChatMessage", chatMessageSchema);
