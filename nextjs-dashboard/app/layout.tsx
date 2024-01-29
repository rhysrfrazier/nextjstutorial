import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts'

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
