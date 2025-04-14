import { connectToDatabase } from "@/lib/mongodb";
import { UserContactModel } from "@/models/user-contact.model";
import { UserModel } from "@/models/user.model";
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meId: string }> }
) {
  try {
    const { meId } = await params;
    const body = await request.json();
    const username = body.contactUsername as string;
    await connectToDatabase();
    const contact = await UserModel.findOne().where({
      username,
    });
    if (!contact) throw new Error("Contact not found");
    if (contact._id.toString() === meId)
      throw new Error("You cannot add yourself");

    const userContact = await UserContactModel.findOneAndUpdate(
      {
        user: meId,
      },
      {
        $addToSet: {
          contacts: contact._id,
        },
      },
      {
        new: true,
      }
    )
      .populate("user", "_id")
      .populate("contacts");
    return Response.json(userContact, {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Generic Error" },
      { status: 500 }
    );
  }
}
