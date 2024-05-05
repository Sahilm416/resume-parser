import Link from "next/link";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Postings = ({
  jobs,
}: {
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
  return (
    <div>
      {jobs.length < 1 ? (
        <div className="w-full h-[400px] flex justify-center items-center">
          <h2 className="text-3xl text-center">No Postings</h2>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job,i) => {
              return (
                <TableRow key={i}>
                  <TableCell className="font-medium">{job.title.toUpperCase()}</TableCell>
                  <TableCell>{job.description.slice(0,50)+"..."}</TableCell>
                  <TableCell>{job.applicants.data.length}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/posting/${job.id}`} className="px-5 py-2 border ">
                      view
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Postings;
