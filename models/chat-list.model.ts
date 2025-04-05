import { ContactModel } from "@/models/contact.model";
import { IChatList } from "@/types/global.types";
import mongoose, { Document, Model, Schema } from "mongoose";

type IChatListModel = IChatList & Document;

const chatListSchema: Schema<IChatListModel> = new Schema({
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
  previousMsg: {
    type: {
      date: { type: Date, required: true },
      text: { type: String, required: true },
    },
    required: true,
  },
});

export const ChatListModel: Model<IChatListModel> =
  mongoose.model<IChatListModel>("ChatList", chatListSchema);
