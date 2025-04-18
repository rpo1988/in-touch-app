import { connectToDatabase } from "@/lib/mongodb";
import { ChatModel } from "@/models/chat.model";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meId: string }> }
) {
  try {
    const { meId } = await params;
    const body = await request.json();
    const contactId = body.contactId as string;
    await connectToDatabase();
    const meObjectId = new mongoose.Types.ObjectId(meId);
    const contactObjectId = new mongoose.Types.ObjectId(contactId);
    const newChat = await ChatModel.create({
      createdBy: meObjectId,
      members: [contactObjectId],
    });
    return Response.json(newChat, {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Generic Error" }, { status: 500 });
  }
}
