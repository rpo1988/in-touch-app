import { connectToDatabase } from "@/lib/mongodb";
import { ChatMessageModel } from "@/models/chat-message.model";
import { IChatMessageStatus } from "@/types/global.types";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meId: string; chatId: string }> }
) {
  try {
    const { meId, chatId } = await params;
    const body = await request.json();
    const text = body.text as string;
    await connectToDatabase();
    const meObjectId = new mongoose.Types.ObjectId(meId);
    const chatObjectId = new mongoose.Types.ObjectId(chatId);
    const newChatMessage = await ChatMessageModel.create({
      chat: chatObjectId,
      createdBy: meObjectId,
      text,
      status: IChatMessageStatus.Received,
    });
    return Response.json(newChatMessage, {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Generic Error" }, { status: 500 });
  }
}
