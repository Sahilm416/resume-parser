import { NextResponse } from "next/server";
//@ts-ignore
import { sign } from "jsonwebtoken";
export const POST = async (req: Request) => {
  const { email, role } = await req.json();

  try {
    const token = await sign(
      { email: email, role: role },
      process.env.JWT_SECRET!
    );

    console.log(token);

    return NextResponse.json(
      { success: true, message: "Token successfully generated." , token: token},
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error occured while generating token." },
      { status: 500 }
    );
  }
};




