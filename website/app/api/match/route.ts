import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: Request) => {
  const { id, description } = await req.json();
  console.log(id,description)
  const res = await fetch(process.env.MODAL_MATCH!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client: `${id}`,
      data: description,
    }),
  });

  const response = await res.json();

  console.log(response);

  return NextResponse.json(
    {
      data: response.result,
    },
    { status: 200 }
  );
};
