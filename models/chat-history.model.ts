import { ContactModel } from "@/models/contact.model";
import { IChatHistory } from "@/types/global.types";
import mongoose, { Document, Model, Schema } from "mongoose";

type IChatHistoryModel = IChatHistory & Document;

const chatHistorySchema: Schema<IChatHistoryModel> = new Schema({
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ContactModel.modelName,
    required: true,
  },
  me: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ContactModel.modelName,
    required: true,
  },
  history: [
    {
      type: {
        date: { type: Date, required: true },
        text: { type: String, required: true },
      },
      required: true,
    },
  ],
});

export const ChatHistoryModel: Model<IChatHistoryModel> =
  mongoose.model<IChatHistoryModel>("ChatHistory", chatHistorySchema);
