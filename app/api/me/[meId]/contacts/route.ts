import { connectToDatabase } from "@/lib/mongodb";
import { UserContactModel } from "@/models/user-contact.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ meId: string }> }
) {
  try {
    const { meId } = await params;
    await connectToDatabase();
    const userContact = await UserContactModel.findOne()
      .where({
        user: meId,
      })
      .populate("user", "_id")
      .populate("contacts");
    return NextResponse.json(userContact, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Generic Error" }, { status: 500 });
  }
}
