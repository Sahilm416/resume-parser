"use client";
import { Button } from "../ui/button";
import Postings from "./Postings";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { createNewJob } from "@/actions/dashboard";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const Company = ({
  data,
  jobs,
}: {
  data: { fname: string; lname: string; email: string; company: string };
  jobs: [
    {
      id: number;
      title: string;
      description: string;
      posted_by: { email: string; company: string };
      applicants: { data: [] };
    }
  ];
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  if (data.email === "") {
    return (
      <div className="w-full flex justify-center items-center h-[400px]">
        <h2>Logging Out....</h2>
      </div>
    );
  }

  const fakeLoad = async () => {
    return;
  };

  const handleSubmit = async (formData: FormData) => {
    await fakeLoad();
    setLoading(true);
    const title = formData.get("title") as string;
    let description = formData.get("desc") as string;

    // Replace escaped newlines with actual newlines
    description = description.replace(/\\n/g, "\n");

    // Input checks
    if (title.length < 10) {
      toast.error("Title should be at least 10 characters long.");
      setLoading(false);
      return;
    }

    if (description.length < 50) {
      toast.error("Description should be at least 50 characters long.");
      setLoading(false);
      return;
    }

    console.log(title, description);

    const res = await createNewJob({
      title: title,
      description: description,
      email: data.email,
      company: data.company,
    });

    if (res.success) {
      toast.success(res.message);
      window.location.reload();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="p-5 flex justify-between border bg-zinc-100 font-sans">
        <h1 className="text-3xl font-semibold">
          {data.company}{" "}
          <span className=" text-base text-zinc-700 ml-5 ">
            (via {data.fname} {data.lname} {data.email})
          </span>
        </h1>
        <Dialog>
          <DialogTrigger className="p-2 bg-green-500 text-white rounded-sm">New posting</DialogTrigger>
          <DialogContent>
            <form className="space-y-3" onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(new FormData(e.target as HTMLFormElement));
            }}>
              <DialogHeader>
                <DialogTitle>Create new job posting</DialogTitle>
              </DialogHeader>
              <div className="p-2 flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="title">Job title</Label>
                  <Input
                    name="title"
                    id="title"
                    type="text"
                    placeholder="FULLSTACK DEVELOPER"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    name="desc"
                    id="desc"
                    placeholder="enter description"
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedValue = value.replace(/\n/g, "\\n");
                      e.target.value = formattedValue;
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose className="p-2 border rounded-sm mr-3 w-[120px]" type="button">close</DialogClose>
                <Button className="w-[150px] bg-green-500 hover:bg-green-600">
                  {loading ? (
                    <Loader2 className=" animate-spin duration-300" />
                  ) : (
                    "create"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Postings jobs={jobs} />
    </div>
  );
};

export default Company;