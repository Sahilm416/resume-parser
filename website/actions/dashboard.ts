"use server";
import { supabase } from "@/lib/supabse/db";
import { getSession } from "./auth";

export const getCurrentUser = async () => {
  const { data } = await getSession();
  if (!data?.email) {
    return {
      /* @ts-ignore */
      fname: "",
      /* @ts-ignore */
      lname: "",
      /* @ts-ignore */
      email: "",
      /* @ts-ignore */
      company: "",
    };
  }
  const res = await supabase.from("users").select("*").eq("email", data.email);

  /* @ts-ignore */
  const user = {
    /* @ts-ignore */
    fname: res.data[0].fname,
    /* @ts-ignore */
    lname: res.data[0].lname,
    /* @ts-ignore */
    email: res.data[0].email,
    /* @ts-ignore */
    company: res.data[0].company,
  };

  return user;
};

export const getJobsPostedByUser = async () => {
  try {
    const { data } = await getSession();

    if (!data.email) {
      return [];
    }
    const res =
      (await supabase.from("users").select("*").eq("email", data.email)) ||
      null;

    /* @ts-ignore */
    const user = {
      /* @ts-ignore */
      fname: res.data[0].fname,
      /* @ts-ignore */
      lname: res.data[0].lname,
      /* @ts-ignore */
      email: res.data[0].email,
      /* @ts-ignore */
      company: res.data[0].company,
    };

    //   console.log(user.email)
    const result = await supabase
      .from("jobs")
      .select("*")
      .eq("posted_by->>email", user.email);

    return result.data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createNewJob = async ({
  title,
  description,
  email,
  company,
}: {
  title: string;
  description: string;
  email: string;
  company: string;
}) => {
  const res = await supabase
    .from("jobs")
    .insert({
      title: title,
      description: description,
      posted_by: { email: email, company: company },
      applicants: { data: [] },
    })
    .select("id");

  console.log(res);
  if (res.statusText === "Created") {
    //@ts-ignore
    // const id = res.data[0].id as string;
    // const response = await fetch("https://sohel1807--upsert.modal.run", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     client: id.toString(),
    //     data: description,
    //   }),
    // });
    // const finalResponse = await response.json();
    // console.log(finalResponse);
    // if (response.ok) {
      
    //   return {
    //     success: true,
    //     message: "Job created successfully",
    //   };
    // }

    return {
      success: true,
      message: "Created job successfully",
    };
  } else {
    return {
      success: false,
      message: "failed to create job",
    };
  }
};

export const getJob = async ({ id }: { id: number }) => {
  const res = await supabase.from("jobs").select("*").eq("id", id);
  //@ts-ignore
  return res.data[0] || {};
};

export const deleteJob = async ({ id }: { id: number }) => {
  const res = await supabase.from("jobs").delete().eq("id", id);
  return {
    succuess: true,
    message: "Job deleted successfully",
  };
};
