import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkSignUpEmail, createNewAccount } from "@/actions/auth";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyVerificationCode } from "redshield";
import { useRouter } from "next/navigation";

export default function SignUpCompany() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [dialog, setDialog] = useState<boolean>(false);
  const [user, setUser] = useState<{
    email: string;
    password: string;
    fname: string;
    lname: string;
    company: string;
  }>({ email: "", password: "", fname: "", lname: "" , company: ""});
  const fakeLoad = async () => {
    return;
  };
  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fname = formData.get("first-name") as string;
    const lname = formData.get("last-name") as string;
    const company = formData.get("company") as string;

    await fakeLoad();
    setLoading(true);
    const res = await checkSignUpEmail({
      email: email,
      password: password,
      fname: fname,
      lname,
    });
    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      setDialog(true);
      setUser({ email: email, password: password, fname: fname, lname: lname , company: company });
    }

    // setDialog(true);

    setLoading(false);
  };

  const handleVerification = async (code: string) => {
    setLoading(true);
    toast.promise(verifyVerificationCode({ email: user.email, code: code }), {
      loading: "Veifying verification code...",
      success: (res) => {
        if (res.status) {
          toast.promise(
            createNewAccount({
              email: user.email,
              password: user.password,
              fname: user.fname,
              lname: user.lname,
              role: "company",
              comapny: user.company
            }),
            {
              success: (res) => {
                // console.log(res);
                if (res.success) {
                  router.refresh();
                  router.push("/");
                  return res.message;
                }

                throw new Error(res.message);
              },
              error: (err) => {
                return "Error creating account";
              },
            }
          );

          return res.message;
        }
        throw new Error(res.message);
      },
      error: (err) => {
        return "Email verification failed";
      },
    });

    setLoading(false);
  };
  return (
    <>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up for company</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    name="first-name"
                    id="first-name"
                    placeholder="Max"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    name="last-name"
                    id="last-name"
                    placeholder="Robinson"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company name</Label>
                <Input
                  name="company"
                  id="company"
                  type="text"
                  placeholder="Acme inc."
                  required
                />
              </div>
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
                <Label htmlFor="password">Password</Label>
                <Input name="password" id="password" type="password" />
              </div>
              <Button
                disabled={loading}
                type="submit"
                className="w-full bg-green-500 text-white hover:bg-green-600"
              >
                {loading ? (
                  <Loader2 className=" animate-spin duration-300" />
                ) : (
                  "Create an account"
                )}
              </Button>
              <Button disabled variant="outline" className="w-full">
                Sign up with GitHub
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/signin" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
      <Dialog open={dialog}>
        <DialogContent className="w-auto justify-center px-10 space-y-3">
          <DialogHeader>
            <DialogTitle className=" text-2xl">
              Enter verification code
            </DialogTitle>
          </DialogHeader>
          <InputOTP
            onComplete={async (val) => {
              const res = await handleVerification(val);
              setDialog(false);
              console.log(res);
            }}
            className="w-[400px]"
            maxLength={6}
          >
            <InputOTPGroup>
              <InputOTPSlot className="border-zinc-500" autoFocus index={0} />
              <InputOTPSlot className="border-zinc-500" index={1} />
              <InputOTPSlot className="border-zinc-500" index={2} />
              <InputOTPSlot className="border-zinc-500" index={3} />
              <InputOTPSlot className="border-zinc-500" index={4} />
              <InputOTPSlot className="border-zinc-500" index={5} />
            </InputOTPGroup>
          </InputOTP>
          <DialogFooter className="gap-5">
            <Button
              className="w-full"
              variant={"outline"}
              onClick={() => setDialog(false)}
            >
              close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
