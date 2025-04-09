import { connectToDatabase } from "@/lib/mongodb";
import { ChatMessageModel } from "@/models/chat-message.model";
import { ChatModel } from "@/models/chat.model";
import { IChat, IChatInfo, IChatMessage } from "@/types/global.types";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ meId: string }> }
) {
  try {
    const { meId } = await params;
    await connectToDatabase();
    const meObjectId = new mongoose.Types.ObjectId(meId);
    const chatList = await ChatModel.aggregate<IChat>([
      // 1. Filtrar chats donde el usuario esté como origen
      {
        $match: {
          sourceContact: meObjectId,
        },
      },
      // 2. Poblar sourceContact
      {
        $lookup: {
          from: "contacts",
          localField: "sourceContact",
          foreignField: "_id",
          as: "sourceContact",
        },
      },
      // 3. Poblar targetContact
      {
        $lookup: {
          from: "contacts",
          localField: "targetContact",
          foreignField: "_id",
          as: "targetContact",
        },
      },
      // 4. Desenrollar los arrays resultantes de $lookup (porque devuelve arrays)
      {
        $unwind: "$sourceContact",
      },
      {
        $unwind: "$targetContact",
      },
    ]);
    const lastChatMessages = await ChatMessageModel.aggregate<IChatMessage>([
      // 1. Filtrar mensajes donde el usuario esté involucrado
      {
        $match: {
          chat: {
            $in: chatList.map((chat) => chat._id),
          },
        },
      },
      // 2. Ordenar por createdAt descendente (más reciente primero)
      {
        $sort: {
          createdAt: -1,
        },
      },
      // 3. Agrupar por chat y tomar el mensaje más reciente
      {
        $group: {
          _id: "$chat",
          lastMessage: { $first: "$$ROOT" },
        },
      },
      // 4. Poblar sourceContact
      {
        $lookup: {
          from: "contacts",
          localField: "lastMessage.sourceContact",
          foreignField: "_id",
          as: "sourceContact",
        },
      },
      // 4. Poblar chat
      {
        $lookup: {
          from: "chats",
          localField: "lastMessage.chat",
          foreignField: "_id",
          as: "chat",
        },
      },
      // 6. Desenrollar los arrays resultantes de $lookup (porque devuelve arrays)
      {
        $unwind: "$sourceContact",
      },
      // 7. Proyectar los campos deseados
      {
        $project: {
          createdAt: "$lastMessage.createdAt",
          updatedAt: "$lastMessage.updatedAt",
          chat: "$lastMessage.chat",
          sourceContact: "$sourceContact",
          text: "$lastMessage.text",
          _id: 0,
        },
      },
    ]);
    const chatInfoList: IChatInfo[] = chatList.map((chat) => ({
      _id: chat._id,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      sourceContact: chat.sourceContact,
      targetContact: chat.targetContact,
      lastChatMessage:
        lastChatMessages.find(
          (chatMessage) =>
            chatMessage.chat._id.toString() === chat._id.toString()
        ) || null,
    }));
    return NextResponse.json(chatInfoList, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Generic Error" }, { status: 500 });
  }
}
