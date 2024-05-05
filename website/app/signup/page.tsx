"use client"
import { useState } from 'react';
import SignUpStudent from "@/components/auth/SignUpStudent";
import SignUpCompany from '@/components/auth/SignUpCompany';

const Page = () => {
  const [selectedTab, setSelectedTab] = useState<string>('student');

  const handleTabChange = (tab:string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="w-full h-[calc(100vh-60px)] py-12 flex justify-between">
      <div className="w-full flex flex-col gap-5">
        <h1 className='text-3xl font-bold'>Select your account type</h1>
        <label className={`p-10 rounded-xl border cursor-pointer ${selectedTab === 'student' ? 'bg-green-500 border-green-500 text-white' : 'bg-green-50 border-green-500'}`} onClick={() => handleTabChange('student')}>
          <input
            type="radio"
            name="accountType"
            value="student"
            checked={selectedTab === 'student'}
            onChange={() => handleTabChange('student')}
            className="hidden"
          />
          <div className="flex items-center">
            <div className={`w-6 h-6 border rounded-full flex items-center justify-center mr-3 ${selectedTab === 'student' ? 'bg-green-500 border-green-500' : 'border-green-500'}`}>
              <div className={`w-3 h-3 rounded-full ${selectedTab === 'student' ? 'bg-white' : ''}`}></div>
            </div>
            <div>
              <h3 className='text-lg font-semibold'>Student Account</h3>
              <p className={`${selectedTab === 'student' ? "text-zinc-50" : "text-zinc-600" }`}>I am a student looking for jobs and internships.</p>
            </div>
          </div>
        </label>
        <label className={`p-10 rounded-xl border cursor-pointer ${selectedTab === 'company' ? 'bg-green-500 border-green-500 text-white' : 'bg-green-50 border-green-500'}`} onClick={() => handleTabChange('company')}>
          <input
            type="radio"
            name="accountType"
            value="company"
            checked={selectedTab === 'company'}
            onChange={() => handleTabChange('company')}
            className="hidden"
          />
          <div className="flex items-center">
            <div className={`w-6 h-6 border rounded-full flex items-center justify-center mr-3 ${selectedTab === 'company' ? 'bg-green-500 border-green-500' : 'border-green-500'}`}>
              <div className={`w-3 h-3 rounded-full ${selectedTab === 'company' ? 'bg-white' : ''}`}></div>
            </div>
            <div>
              <h3 className='text-lg font-semibold'>Company Account</h3>
              <p className={`${selectedTab === 'company' ? "text-zinc-50" : "text-zinc-600" }`}>I am a recruiter looking forward to employees.</p>
            </div>
          </div>
        </label>
      </div>
      <div className="w-full">
        {selectedTab === 'student' ? <SignUpStudent /> : <SignUpCompany/>}
      </div>
    </div>
  );
};

export default Page;

