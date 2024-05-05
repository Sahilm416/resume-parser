import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const instructions =
  "You are an ai that converts the given string resume into an HTML document. You dont respond a single word or character than the HTML resume you keep the Format of the returned HTML consistant for all the requests. You dont give HTML from html tag or body tag or head tag. You only give the presentation of given string into HTML string. Keep that in mind that your whole response is gonna embedded as html in website. Also add inline styles to prsent it more professionally.It should look like a proper resume. Style for allignment and good looking as this is gonna be presented in front of rcrutement team";
export async function POST(req: Request) {
  const { resume } = (await req.json()) as { resume: string };
  if (!resume) {
    return NextResponse.json(
      {
        success: false,
        message: "Please provide a resume",
      },
      { status: 500 }
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY! });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: instructions },
      { role: "user", content: resume },
    ],
    stream: false,
  });

  return NextResponse.json(
    {
      success: true,
      message: "generated the HTML response",
      html: response.choices[0].message.content,
    },
    { status: 200 }
  );
}
