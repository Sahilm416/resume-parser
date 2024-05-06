import Link from "next/link";
import logo from "@/public/logo.jpg";
import Image from "next/image";
import Menu from "./ui/menu"
import { getSession } from "@/actions/auth";
const Navbar = async () => {
  const session = await getSession();
  return (
    <div className="w-full flex justify-center border-b sticky top-0">
      <nav className="flex w-full max-w-[1300px] justify-between items-center h-[60px] bg-white">
        <div className="flex gap-2 items-center">
          <Image src={logo} width={50} height={50} alt="logo" />
          <Link href={"/"} className="text-lg font-semibold font-sans">
            Resume Parser
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Link className="hover:text-green-500 hover:underline" href={"/"}>
            home
          </Link>
          <Link className="hover:text-green-500 hover:underline" href={"/about"}>
            about
          </Link>
          <Link className="hover:text-green-500 hover:underline" href={"mailto:sahilmulani501@gmail.com"}>
            contact
          </Link>

          {session.success && <Menu/>}
          
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
