import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "マイハン診断 | My Hand Finder",
  description: "あなたの象徴ポーカーハンドを診断する",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
