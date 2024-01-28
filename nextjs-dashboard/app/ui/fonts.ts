import { Inter } from 'next/font/google'; // you can pull in any google font this way, and it will be downloaded at build time and hosted with other static assets. No additional network requests required

export const inter =  Inter({subsets: ['latin'] });