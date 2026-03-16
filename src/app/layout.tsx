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
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
