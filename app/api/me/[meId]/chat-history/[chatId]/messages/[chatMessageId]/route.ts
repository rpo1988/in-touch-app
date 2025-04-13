import { connectToDatabase } from "@/lib/mongodb";
import { ChatMessageModel } from "@/models/chat-message.model";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ meId: string; chatId: string; chatMessageId: string }>;
  }
) {
  try {
    const { meId, chatId, chatMessageId } = await params;
    await connectToDatabase();
    const meObjectId = new mongoose.Types.ObjectId(meId);
    const chatObjectId = new mongoose.Types.ObjectId(chatId);
    const chatMessageObjectId = new mongoose.Types.ObjectId(chatMessageId);
    await ChatMessageModel.deleteOne({
      _id: chatMessageObjectId,
      chat: chatObjectId,
      createdBy: meObjectId,
    });
    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Generic Error" }, { status: 500 });
  }
}
