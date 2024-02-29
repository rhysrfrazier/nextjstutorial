import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher for more info
    //so the following is "negative lookahead," and all but the specified paths will be run through the middleware. 
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}