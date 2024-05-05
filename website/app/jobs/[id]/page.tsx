import { getJob } from "@/actions/dashboard";
import ViewJob from "@/components/jobs/ViewJob";
export const revalidate = 0;
const page = async ({ params }: { params: { id: string } }) => {
  const job = await getJob({ id: Number(params.id) });
  return (
    <div className="w-full h-[calc(100vh-60px)]">
      <ViewJob job={job} />
    </div>
  );
};

export default page;
