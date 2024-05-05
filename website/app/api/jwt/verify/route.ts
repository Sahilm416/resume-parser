//@ts-ignore
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { token } = await req.json();
  try {
    const data = await verify(token, process.env.JWT_SECRET!);

    return NextResponse.json(
      { success: true, message: "valid token", data: data },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 500 }
    );
  }
}
