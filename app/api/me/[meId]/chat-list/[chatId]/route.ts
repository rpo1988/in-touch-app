import { connectToDatabase } from "@/lib/mongodb";
import { ChatMessageModel } from "@/models/chat-message.model";
import { ChatModel } from "@/models/chat.model";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ meId: string; chatId: string }>;
  }
) {
  try {
    const { meId, chatId } = await params;
    await connectToDatabase();
    const meObjectId = new mongoose.Types.ObjectId(meId);
    const chatObjectId = new mongoose.Types.ObjectId(chatId);
    await Promise.all([
      ChatModel.deleteOne({
        _id: chatObjectId,
        createdBy: meObjectId,
      }),
      ChatMessageModel.deleteMany({
        chat: chatObjectId,
      }),
    ]);
    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Generic Error" }, { status: 500 });
  }
}
