import { connectToDatabase } from "@/lib/mongodb";
import { ChatMessageModel } from "@/models/chat-message.model";
import { ChatModel } from "@/models/chat.model";
import { IChatHistory, IChatMessageStatus } from "@/types/global.types";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ meId: string; chatId: string }> }
) {
  try {
    const { chatId } = await params;
    await connectToDatabase();
    const chat = await ChatModel.findById(chatId)
      .populate("createdBy")
      .populate("members");

    if (!chat) throw new Error("ChatId does not exist.");

    const chatMessages = await ChatMessageModel.find()
      .where({
        chat: chat?._id,
      })
      .populate("createdBy")
      .populate("chat");
    const chatHistory: IChatHistory = {
      _id: chat._id,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      createdBy: chat.createdBy,
      members: chat.members,
      history: chatMessages,
    };
    return Response.json(chatHistory, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Generic Error" }, { status: 500 });
  }
}

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
