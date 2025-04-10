import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ meId: string }> }
) {
  try {
    const { meId } = await params;
    await connectToDatabase();
    const profile = await UserModel.findOne().where({
      _id: meId,
    });

    if (!profile) throw new Error("User not found");

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Generic Error" },
      { status: 500 }
    );
  }
}
