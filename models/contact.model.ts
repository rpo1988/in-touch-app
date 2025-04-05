import { IContact } from "@/types/global.types";
import mongoose, { Document, Model, Schema } from "mongoose";

type IContactModel = IContact & Document;

const contactSchema: Schema<IContactModel> = new Schema(
  {
    name: { type: String, required: true },
    statusInfo: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ContactModel: Model<IContactModel> = mongoose.model<IContactModel>(
  "Contact",
  contactSchema
);
