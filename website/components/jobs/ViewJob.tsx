"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { pdfjs } from "react-pdf";
import { applyToJob } from "@/actions/jobs";
import { getSession } from "@/actions/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfReader = ({ file, id }: { file: File; id: number }) => {
  const [pdfText, setPdfText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleApply = async () => {
    try {
      const extractedText = await extractTextFromFile(file);
      if (extractedText) {
        const { data } = await getSession();
        if (data) {
          setLoading(true);
          const res = await fetch("/api/apply", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: data.email,
              resume: extractedText,
              id: id,
            })
          });

          const response = await res.json();
          if (response.success) {
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
          console.log("Applied successfully!");
        } else {
          console.error("No session data found.");
        }
      } else {
        console.error("Failed to extract text from the PDF.");
      }
    } catch (error) {
      console.error("Error while applying:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (arrayBuffer) {
          try {
            const pdf = (await pdfjs.getDocument({ data: arrayBuffer })
              .promise) as any;
            let text = "";
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const pageText = await page.getTextContent();
              pageText.items.forEach((item: any) => {
                if (item.str.trim() !== "") {
                  text += item.str + " ";
                } else {
                  text += "\n";
                }
              });
              text += "\n\n"; // Add an extra newline between pages
            }
            resolve(text);
          } catch (error) {
            reject(error);
          }
        } else {
          reject("Array buffer is empty.");
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div>
      <Button className="w-[120px]" onClick={handleApply}>
        {loading ? <Loader2 className=" animate-spin duration-300" /> : "Apply"}
      </Button>
    </div>
  );
};

const ViewJob = ({
  job,
}: {
  job: {
    id: number;
    title: string;
    description: string;
    posted_by: { email: string; company: string };
    applicants: { data: [] };
  };
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="w-full h-full overflow-y-scroll pb-12 flex flex-col gap-5">
      <div className="border-b px-10 py-5 sticky bg-white/20 backdrop-blur-md top-[0px]">
        <h1 className="text-3xl font-semibold">{job.posted_by.company}</h1> by{" "}
        <span className="text-blue-600"> {job.posted_by.email}</span>
      </div>
      <div className="px-10">
        <h2 className="text-2xl">{job.title}</h2> <br />
        <pre className="whitespace-pre-wrap font-sans">{job.description}</pre>
      </div>
      <div className="px-10 flex justify-between w-[600px] items-center ">
        <div className="flex flex-col gap-2">
          <Label>Select your resume file (pdf)</Label>
          <input type="file" accept="pdf" onChange={handleFileChange} />
        </div>
        {selectedFile && <PdfReader id={job.id} file={selectedFile} />}
      </div>
    </div>
  );
};

export default ViewJob;
