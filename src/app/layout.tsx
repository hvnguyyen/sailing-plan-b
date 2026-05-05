import type { Metadata } from 'next'
import { Playfair_Display, Lora, DM_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '../components/layout/Navbar'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Sailing Plan B',
  description: 'Ulrik & Karen sailing the world on a Najad 343',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${lora.variable} ${dmMono.variable}`}
    >
      <body className="bg-cream text-navy antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  )
}