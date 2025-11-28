import { NextResponse } from "next/server";

export default async function middleware(request) {
    const { pathname, origin } = request.nextUrl;
    if(pathname === '/register'){
        return NextResponse.redirect(new URL("/login", origin));
    }
}

export const config = { 
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/sacco-admin(.*)", "/member(.*)"] 
};
