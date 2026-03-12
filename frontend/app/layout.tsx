import "./globals.css"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AI Document Assistant",
  description: "Upload documents and ask questions with AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body>

        <header className="navbar">

          <div className="logo">
            <span className="logo-icon">📄</span>
            <span className="logo-text">AI Document Assistant</span>
          </div>

          <nav>
            <Link href="/">Upload</Link>
            <Link href="/ask">Ask AI</Link>
          </nav>

        </header>

        <main className="main">
          {children}
        </main>

      </body>
    </html>
  )
}