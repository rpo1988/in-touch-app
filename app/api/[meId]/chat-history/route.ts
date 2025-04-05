import { connectToDatabase } from "@/lib/mongodb";
import { ChatHistoryModel } from "@/models/chat-history.model";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ meId: string }> }
) {
  try {
    const { meId } = await params;
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contactId");
    await connectToDatabase();
    const chatHistory = await ChatHistoryModel.findOne()
      .where({
        contact: contactId,
        me: meId,
      })
      .populate("contact");
    return Response.json(chatHistory, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Generic Error" }, { status: 500 });
  }
}
