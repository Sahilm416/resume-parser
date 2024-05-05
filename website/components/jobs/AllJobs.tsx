import Link from 'next/link';
import React from 'react'

const AllJobs = ({
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


  if(jobs.length < 1){
    return (
      <div className='w-full h-[400px] flex justify-center items-center'>
        <h2 className='text-3xl font-semibold'>No Jobs Available</h2>
      </div>
    )
  }
  return (
    <div className='grid gap-10 grid-cols-2'>
      {
        jobs.map((job,i)=> {
          return (
            <div className='p-5 border border-green-500 bg-zinc-100 rounded-md w-[500px] space-y-2' key={i}>
              <p className='text-2xl font-bold'>{job.title}</p>
              <p className='text-green-500 font-semibold'>{job.posted_by.company}</p>
              <p>{job.description.slice(0,30)+"..."} <span className='text-blue-600'>more</span></p>
              <div className='w-full p-2 flex justify-between items-center'>
                <p className='font-semibold'>{job.applicants.data.length} people applied.</p>
                <Link className='text-white bg-green-500 hover:bg-green-600 w-[120px] text-center p-3 rounded-sm' href={`/jobs/${job.id}`}>view</Link>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default AllJobs