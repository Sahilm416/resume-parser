"use client";
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { deleteJob } from "@/actions/dashboard";
import { useRouter } from "next/navigation";
import { matchApplication, upsertApplications } from "@/actions/jobs";
import { Loader2 } from "lucide-react";

const Job = ({
  job,
}: {
  job: {
    id: number;
    title: string;
    description: string;
    posted_by: { email: string; company: string };
    applicants: { data: [{ email: string; resume: string }] };
  };
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>("Analyzing resumes");
  const [rankedResume, setRankedResume] = useState<
    { Email: string; Content: string; Score: number }[]
  >([]);

  const handleDelete = async () => {
    toast.promise(deleteJob({ id: Number(job.id) }), {
      loading: "deleting job...",
      success: () => {
        router.push("/dashboard");
        router.refresh();
        return "job deleted successfully";
      },
    });
  };

  const fakeLoad = async () => {};
  const handleTop = async () => {
    if (rankedResume.length > 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadingMessage("Analyzing resumes");
    for (let obj of job.applicants.data) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(obj.resume, "text/html");
      let text = doc.body.textContent as string;
      await upsertApplications({ email: obj.email, resume: text, id: job.id });
    }
    await fakeLoad();
    setLoadingMessage("Ranking resumes");
    const res = await matchApplication({ id: job.id, description: job.description });
    setLoading(false);

    // Store the content of each resume along with email and score
    //@ts-ignore
    const rankedResumesWithContent = res.map((resume) => ({
      Email: resume.Email,
      Content: job.applicants.data.find((applicant) => applicant.email === resume.Email)?.resume || "",
      Score: resume.Score,
    }));

    setRankedResume(rankedResumesWithContent.slice(0, 5)); // Limit to top 5 resumes
  };

  return (
    <div className="w-full h-full overflow-y-scroll flex flex-col gap-5">
      <div className="flex justify-between sticky top-0 px-10 py-5 border-b bg-white/10 backdrop-blur-md">
        <h1 className="text-3xl font-semibold">{job.title}</h1>
        <Dialog>
          <DialogTrigger className="bg-red-500 text-white p-2 w-[120px] rounded-sm">
            Delete
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure ?</DialogTitle>
              <DialogDescription>This action can't be undone.</DialogDescription>
            </DialogHeader>
            <p>
              It'll delete all the data related to{" "}
              <span className=" font-semibold">{job.title}</span> listing from our server.{" "}
            </p>
            <DialogFooter>
              <DialogClose className="p-2 rounded-sm border w-[120px]">cancel</DialogClose>
              <DialogClose
                onClick={handleDelete}
                className="bg-red-500 p-2 w-[150px] border rounded-sm text-white"
              >
                confirm delete
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="px-10">
        <div dangerouslySetInnerHTML={{ __html: job.description }} />
      </div>
      <div className="flex w-full justify-center mt-10 border p-5">
        {/* <div className="w-full flex justify-center items-start">
            <div className="p-5 border rounded-md">
              <h1 className="text-7xl font-bold">AI Powered <br />
              Resume Parser</h1>
            </div>
        </div> */}
        <Tabs defaultValue="all" className="w-full max-w-[1200px] overflow-y-auto">
          <TabsList className="w-full">
            <TabsTrigger onClick={handleTop} className="w-full" value="top">
              Top Applications
            </TabsTrigger>
            <TabsTrigger className="w-full" value="all">
              All Applications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top">
            {loading ? (
              <div className="w-full justify-center flex items-center gap-3 h-[300px]">
                <p>{loadingMessage}</p>
                <Loader2 className=" animate-spin duration-300" />
              </div>
            ) : (
              <div>
                {rankedResume.map((resume, index) => (
                  <div
                    key={index}
                    className="p-3 my-2 rounded-md border border-blue-500 bg-blue-50 flex items-center justify-between"
                  >
                    <p className="w-[250px]">{resume.Email}</p>
                    <p>{resume.Score.toFixed(2)} %</p>
                    <Dialog>
                      <DialogTrigger className="p-2 border bg-blue-500 hover:bg-blue-600 text-white rounded-md w-[120px]">
                        view
                      </DialogTrigger>
                      <DialogContent className="max-w-[800px] h-auto max-h-[600px] overflow-y-auto">
                        <div dangerouslySetInnerHTML={{ __html: resume.Content }} />
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="all">
            {job.applicants.data.map((a, i) => (
              <div
                key={i}
                className="p-3 my-2 rounded-md border border-green-500 bg-green-50 flex items-center justify-between"
              >
                <p>{a.email}</p>
                <Dialog>
                  <DialogTrigger className="p-2 border bg-green-500 hover:bg-green-600 text-white rounded-md w-[120px]">
                    view
                  </DialogTrigger>
                  <DialogContent className="max-w-[800px] h-auto max-h-[600px] overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: a.resume }} />
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Job;
