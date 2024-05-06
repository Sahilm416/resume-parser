import { getAllJobs } from "@/actions/jobs";
import AllJobs from "@/components/jobs/AllJobs";

const page = async () => {
  const jobs = (await getAllJobs()) as [
    {
      id: number;
      title: string;
      description: string;
      posted_by: { email: string; company: string };
      applicants: { data: [] };
    }
  ];
  return (
    <div className="w-full h-[calc(100vh-60px)] flex flex-col py-5">
      <div className="sticky top-0 border-b px-10 pb-5 bg-white/10 backdrop-blur-md">
        <h1 className="text-3xl font-semibold">All job postings</h1>
      </div>
      <div className="px-10 py-5 h-full flex justify-center overflow-y-scroll">
        <AllJobs jobs={jobs} />
      </div>
    </div>
  );
};

export default page;

// "use client"
// import React, { useState, useEffect } from 'react';
// import { pdfjs} from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// interface PdfReaderProps {
//   file: File;
// }

// const PdfReader: React.FC<PdfReaderProps> = ({ file }) => {
//   const [pdfText, setPdfText] = useState<string>('');

//   const handleTextExtraction = async () => {
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
//     let text = '';
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const pageText = await page.getTextContent();
//       pageText.items.forEach((item: any) => {
//         text += item.str + ' ';
//       });
//     }
//     setPdfText(text);
//   };

//   useEffect(() => {
//     handleTextExtraction();
//   }, [file]);

//   return (
//     <div>
//       <h2>PDF Text Content:</h2>
//       <pre>{pdfText}</pre>
//     </div>
//   );
// };

// const MyComponent: React.FC = () => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       {selectedFile && <PdfReader file={selectedFile} />}
//     </div>
//   );
// };

// export default MyComponent;
