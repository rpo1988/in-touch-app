import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = body.username as string;
    const name = body.name as string;
    const statusInfo = body.statusInfo as string;
    await connectToDatabase();
    const newUser = await UserModel.create({
      username,
      name,
      statusInfo,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          error?.code === 11000
            ? "Username already exists"
            : error instanceof Error
            ? error.message
            : "Generic Error",
      },
      { status: 500 }
    );
  }
}
