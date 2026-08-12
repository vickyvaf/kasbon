import type { Metadata } from 'next'
import { QueryProvider } from '@/providers/QueryProvider'
import { AppToaster } from '@/components/AppToaster'
import './globals.css'

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
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          {children}
          <AppToaster />
        </QueryProvider>
      </body>
    </html>
  )
}
