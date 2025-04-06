import { connectToDatabase } from "@/lib/mongodb";
import { ChatHistoryModel } from "@/models/chat-history.model";
import { IChatMessage } from "@/types/global.types";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meId: string; chatId: string }> }
) {
  try {
    const { chatId } = await params;
    const body = await request.json();
    const text = body.text as string;
    await connectToDatabase();
    const message: Omit<IChatMessage, "_id"> = {
      date: new Date(),
      text,
      sentByMe: true,
    };
    await ChatHistoryModel.findByIdAndUpdate(chatId, {
      $push: { history: message },
    });
    return Response.json(message, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Generic Error" }, { status: 500 });
  }
}
