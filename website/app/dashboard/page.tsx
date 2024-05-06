import { getCurrentUser, getJobsPostedByUser } from "@/actions/dashboard";
import Company from "@/components/dashboard/Company";
export const revalidate = 0;
const page = async () => {
  const data = await getCurrentUser();
  const jobs = (await getJobsPostedByUser()) as [
    {
      id: number;
      title: string;
      description: string;
      posted_by: { email: string; company: string };
      applicants: { data: [] };
    }
  ];

  return (
    <div className="w-full h-[calc(100vh-60px)]">
      <Company jobs={jobs} data={data} />
    </div>
  );
};

export default page;
