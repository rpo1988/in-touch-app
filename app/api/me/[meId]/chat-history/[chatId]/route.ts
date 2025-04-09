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
      .populate("sourceContact")
      .populate("targetContact");

    if (!chat) throw new Error("ChatId does not exist.");

    const chatMessages = await ChatMessageModel.find()
      .where({
        chat: chat?._id,
      })
      .populate("sourceContact")
      .populate("chat");
    const chatHistory: IChatHistory = {
      _id: chat._id,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      sourceContact: chat.sourceContact,
      targetContact: chat.targetContact,
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

// export async function POST(
//   request: NextRequest,
//   { params }: { params: Promise<{ meId: string; chatId: string }> }
// ) {
//   try {
//     const { chatId } = await params;
//     const body = await request.json();
//     const text = body.text as string;
//     await connectToDatabase();
//     const message: Omit<IChatMessage, "_id" | 'createdAt' | 'updatedAt'> = {
//       text,
//     };
//     await ChatHistoryModel.findByIdAndUpdate(chatId, {
//       $push: { history: message },
//     });
//     return Response.json(message, {
//       status: 200,
//     });
//   } catch (error) {
//     console.error(error);
//     return Response.json({ message: "Generic Error" }, { status: 500 });
//   }
// }
