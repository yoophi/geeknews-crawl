import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "GeekNews Vault",
  description: "Local backup + graph viewer for news.hada.io",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="site-header">
          <nav>
            <a href="/">최근</a>
            <a href="/tags">태그</a>
            <a href="/graph">그래프</a>
            <a href="/favorited">즐겨찾기</a>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
