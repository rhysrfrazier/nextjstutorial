import type { NextAuthConfig } from "next-auth";

//without adding this, your user will be redirected to the default NextAuth page, which wouldn't be very professional looking
export const authConfig = {
    pages: {
        signIn: "/login",
    },
    //now we add the middleware and logic that will prevent users from accessing the dashboard unless they're logged in:
    callbacks: {
        //the auth property contains a user's session, and the request property contains the incoming request
        authorized({ auth, request: { nextUrl } }) {
            //!! coerces to a boolean, so isLoggedIn will either be true or false
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            if (isOnDashboard) {
                //this is a bit of shorthand for a conditional that doesn't use "else", which you can do here because you either return true, and never reach the part that returns false, or you return false
                if (isLoggedIn) return true;
                return false //redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl))
            }
            //if they aren't logged in and aren't trying to access a dashboard page, we return true, indicating that they're authorized to view the login page (they can't view it and try to login if they're already logged in)
            return true;
        }
    },
    providers: [],
} satisfies NextAuthConfig