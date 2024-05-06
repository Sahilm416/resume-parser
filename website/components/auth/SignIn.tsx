"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/next.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signIn } from "@/actions/auth";
import { toast } from "sonner";
import {Loader2} from "lucide-react"
export default function SignInPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const fakeLoad = async () => {
    return;
  };
  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await fakeLoad();
    setLoading(true);
    const res = await signIn({ email: email, password: password });

    if (res.success) {
      toast.success(res.message);
      window.location.reload();
    } else {
      toast.error(res.message);
    }

    setLoading(false);
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-start justify-center py-20">
        <form action={handleSubmit}>
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link> */}
                </div>
                <Input name="password" id="password" type="password" required />
              </div>
              <Button
                disabled={loading}
                type="submit"
                className="w-full bg-green-500 text-white hover:bg-green-600"
              >
                {loading ? <Loader2 className=" animate-spin duration-300"/> : "login"}
              </Button>
              <Button disabled variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={logo}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
