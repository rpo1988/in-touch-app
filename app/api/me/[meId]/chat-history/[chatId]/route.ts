import { connectToDatabase } from "@/lib/mongodb";
import { ChatMessageModel } from "@/models/chat-message.model";
import { ChatModel } from "@/models/chat.model";
import { IChatHistory } from "@/types/global.types";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ meId: string; chatId: string }> }
) {
  try {
    const { chatId } = await params;
    await connectToDatabase();
    const chat = await ChatModel.findById(chatId)
      .populate("createdBy", "_id name")
      .populate("members", "_id name");

    if (!chat) throw new Error("ChatId does not exist.");

    const chatMessages = await ChatMessageModel.find()
      .where({
        chat: chat?._id,
      })
      .populate("createdBy", "_id name")
      .populate("chat", "_id");
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
