import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = body.username as string;
    await connectToDatabase();
    const profile = await UserModel.findOne().where({
      username,
    });

    if (!profile) throw new Error("Username not found");

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Generic Error" },
      { status: 500 }
    );
  }
}
