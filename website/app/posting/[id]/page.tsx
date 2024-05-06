import { getJob } from "@/actions/dashboard";
import Job from "@/components/dashboard/Job";
const page = async ({ params }: { params: { id: string } }) => {
  const job = (await getJob({ id: Number(params.id) })) as {
    id: number;
    title: string;
    description: string;
    posted_by: { email: string; company: string };
    applicants: { data: [{email: string , resume: string}] };
  };
  return (
    <div className="w-full h-[calc(100vh-60px)]">
      <Job job={job} />
    </div>
  );
};

export default page;
