"use server";

import { supabase } from "@/lib/supabse/db";

export const getAllJobs = async () => {
  const res = await supabase.from("jobs").select("*");

  return res.data || [];
};

export const applyToJob = async ({
  email,
  resume,
  id,
}: {
  email: string;
  resume: string;
  id: number;
}) => {
  try {
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
      return {
        success: false,
        message: "Already applied to the job!",
      };
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

    return {
      success: true,
      message: "Successfully applied to the job",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error applying to the job",
    };
  }
};

export const upsertApplications = async ({
  email,
  resume,
  id,
}: {
  email: string;
  resume: string;
  id: number;
}) => {

  // const strId = id.toString();

  // console.log(strId , typeof(strId))
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

  // console.log(res)

  const response = await res.json();
  // console.log(response);
};



export const matchApplication = async ({id, description}:{id:number,description: string})=>{
   const res = await fetch(process.env.MODAL_MATCH!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client: id.toString(),
      data: description
    })
   })

   const response = await res.json();

   console.log(response)

   return response.result;
}