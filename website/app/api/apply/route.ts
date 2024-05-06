import { supabase } from "@/lib/supabse/db";
import { NextResponse } from "next/server";


export const runtime = "edge";
export const POST = async (req: Request) => {
  try {
    const { email, resume, id } = await req.json();
    const { data: jobData, error } = await supabase
      .from("jobs")
      .select("applicants")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    const existingApplicants = jobData.applicants.data || [];

    const applicantExists = existingApplicants.some(
      (applicant: { email: string }) => applicant.email === email
    );

    if (applicantExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Already applied to the job!",
        },
        { status: 400 }
      );
    }

    const result = await fetch(process.env.HTML_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume: resume,
      }),
    });

    const htmlResume = (await result.json()) as { html: string };
    const html = htmlResume.html || resume;

    existingApplicants.push({ email: email, resume: html });

    const { error: updateError } = await supabase
      .from("jobs")
      .update({ applicants: { data: existingApplicants } })
      .eq("id", id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully applied to the job",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error applying to the job",
      },
      { status: 500 }
    );
  }
};
