import React from "react";
import hero from "@/public/hero.png"
import Image from "next/image";
import Link from "next/link";
const Header = () => {
  return (
    <div className="w-full flex sm:flex-row flex-col justify-between">
      <div className="flex flex-col gap-5 text-start sm:pt-[200px] pt-[100px] sm:h-[calc(100vh-60px)]">
        <h1 className="text-7xl font-bold font-sans">
          Parse resumes <br /> like never before
        </h1>
        <p>Decode resumes , Unlock talent!</p>
        <div className="flex gap-5">
          <Link href={'/signin'} className="p-3 w-[150px] text-center bg-green-500 rounded-full text-white">
            get started
          </Link>
          <button className="p-3 w-[150px] border border-green-500 rounded-full text-green-500 bg-green-50">
            learn more
          </button>
        </div>
      </div>
      <div className="pt-[100px] ">
          <Image className="" src={hero} width={500} height={100} alt="Hero image"/>
      </div>
    </div>
  );
};

export default Header;
