import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: Request) => {
  const { email, resume, id } = await req.json();
  console.log(email , id)
  let res = await fetch(process.env.MODAL_UPSERT!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client: id.toString(),
      data: [
        {
          Email: email,
          content: resume,
        },
      ],
    }),
  });

  //   const response = await res.json();

  //   console.log(response);

  return NextResponse.json(null, { status: 200 });
};
