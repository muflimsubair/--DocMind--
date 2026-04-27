import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'DocMind',
  description: 'AI Document Assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-[#222222] min-h-screen flex flex-col">
        {/* GLOBAL NAVBAR - AIRBNB STYLE */}
        <nav className="border-b border-gray-200 sticky top-0 bg-white z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-airbnb font-bold text-2xl tracking-tight">
              <span>📄</span>
              <span className="text-airbnb">DocMind</span>
            </Link>

            {/* Links */}
            <div className="flex items-center gap-8 font-medium text-gray-600">
              <Link href="/" className="hover:text-black transition">Upload</Link>
              <Link href="/ask" className="hover:text-black transition">Ask AI</Link>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}