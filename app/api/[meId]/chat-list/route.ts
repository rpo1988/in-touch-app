import { connectToDatabase } from "@/lib/mongodb";
import { ChatListModel } from "@/models/chat-list.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ meId: string }> }
) {
  try {
    const { meId } = await params;
    await connectToDatabase();
    const chatList = await ChatListModel.find()
      .where({
        me: meId,
      })
      .populate("contact");
    return NextResponse.json(chatList, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Generic Error" }, { status: 500 });
  }
}
