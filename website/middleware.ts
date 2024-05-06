import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/actions/auth";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const session = await getSession();
  //if already authenticated then redirect back to desired page
  if (url.pathname === "/signin" || url.pathname === "/signup") {
    if (session.success) {
      //add path where logged in user should be redirected
      if (session.data.role === "company") {
        url.pathname = "/dashboard";
      } else {
        url.pathname = "/jobs";
      }

      return NextResponse.redirect(url);
    } else {
      return NextResponse.next();
    }
  }
  //this redirects the users to auth page if not authenticated
  if (session.success) {
    if (url.pathname === "/dashboard" && session.data.role === "student") {
      url.pathname = "/jobs";
      return NextResponse.redirect(url);
    }

    if (url.pathname === "/jobs" && session.data.role === "company") {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } else {
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }
}
export const config = {
  //add routes in matcher array to protect them from unauthenticated users
  matcher: ["/signin", "/signup", "/dashboard", "/jobs/:path*" , "/posting/:path*"],
};
