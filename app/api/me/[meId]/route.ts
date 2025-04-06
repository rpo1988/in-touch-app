import { connectToDatabase } from "@/lib/mongodb";
import { ContactModel } from "@/models/contact.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ meId: string }> }
) {
  try {
    const { meId } = await params;
    await connectToDatabase();
    const profile = await ContactModel.findOne().where({
      _id: meId,
    });
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Generic Error" }, { status: 500 });
  }
}
