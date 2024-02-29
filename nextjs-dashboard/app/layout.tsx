import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts'
import { Metadata } from 'next';

//https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields for more info
export const metadata: Metadata = {
  title: {
    //%s in the template will be replaced by the specific page title, which we'll add in each page. check out the invoice page for an example
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard'
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  //in practice, you'll want to put the base url with the domain name here
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh')
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
      {/* applying the inter classname to the body element applies the font throughout the entire application. antialiased is a Tailwind attribute that smooths the edges of the font */}
    </html>
  );
}
