import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { QueryProvider } from '@/providers/QueryProvider'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'Kasbon — Catatan Utang Piutang',
  description: 'Web aplikasi sederhana untuk mencatat dan mengelola utang-piutang pribadi.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="id"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className={`${manrope.className} min-h-full flex flex-col`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
