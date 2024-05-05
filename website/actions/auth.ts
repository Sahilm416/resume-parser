"use server";
import { supabase } from "@/lib/supabse/db";
import { sendEmailVerificationCode } from "redshield";
import { cookies } from "next/headers";
export const checkSignUpEmail = async ({
  email,
  password,
  fname,
  lname,
}: {
  email: string;
  password: string;
  fname: string;
  lname: string;
}) => {
  try {
    const res = await supabase.from("users").select("email").eq("email", email);

    const checkUserExists = res.data?.length !== 0;

    if (checkUserExists) {
      return {
        success: false,
        message: "user already exists",
      };
    }

    console.log(email);

    const response = await sendEmailVerificationCode({ email: email });

    return {
      success: response.status,
      message: response.message,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "something went wrong",
    };
  }
};

//create new account

export const createNewAccount = async ({
  email,
  password,
  fname,
  lname,
  role,
  comapny,
}: {
  email: string;
  password: string;
  fname: string;
  lname: string;
  role: string;
  comapny?: string;
}) => {
  try {
    const res = await supabase.from("users").insert({
      email: email,
      password: password,
      role: role,
      company: comapny || "NA",
      fname: fname,
      lname: lname,
    });
    console.log(res);
    if (res.statusText === "Created") {
      const coookieStore = cookies();

      const token = await assignJWTCookie({ email: email, role: role });
      console.log(token);
      coookieStore.set("_auth_token", token, {
        maxAge: 2000000,
      });

      return {
        success: true,
        message: "Account created successfully",
      };
    } else {
      return {
        success: false,
        message: res.error?.message,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "something went wrong",
    };
  }
};

//assign JWT cookie
export const assignJWTCookie = async ({
  email,
  role,
}: {
  email: string;
  role: string;
}) => {
  const res = await fetch(process.env.JWT_SIGN_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email: email,
      role: role,
    }),
  });

  const response = await res.json();
  return response.token;
};

export const getSession = async () => {
  const cookieStore = cookies();

  const token = cookieStore.get("_auth_token")?.value;

  try {
    const res = await fetch(process.env.JWT_VERIFY_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
      }),
    });

    const response = await res.json();
    return {
      success: response.success,
      message: response.message,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "error verifying token",
      data: {},
    };
  }
};

export const logOut = async () => {
  const cookieStore = cookies();
  cookieStore.delete("_auth_token");
};


//sign in functionality
export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await supabase.from("users").select("*").eq("email", email);
  //@ts-ignore
  if (user.data[0]) {
    //@ts-ignore
    if (user.data[0].password === password) {
      
      const token = await assignJWTCookie({
        email: email,//@ts-ignore
        role: user.data[0].role,
      });

      const cookieStore = cookies();
      cookieStore.set("_auth_token", token);
      return {
        success: true,
        message: "sign in successfully",
      };
    } else {
      return {
        success: false,
        message: "Invalid email and password",
      };
    }
  } else {
    return {
      success: false,
      message: "not found",
    };
  }
};