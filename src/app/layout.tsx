import type { Metadata } from 'next'
import { Playfair_Display, Lora, DM_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

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
  metadataBase: new URL('https://www.sailing-planb.com'),
  title: {
    default: 'Sailing Plan B',
    template: '%s | Sailing Plan B',
  },
  description: 'Ulrik & Karen sailing the world on a Najad 343',
  openGraph: {
    title: 'Sailing Plan B',
    description: 'Ulrik & Karen sailing the world on a Najad 343',
    type: 'website',
    locale: 'en_GB',
    siteName: 'Sailing Plan B',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sailing Plan B',
    description: 'Ulrik & Karen sailing the world on a Najad 343',
  },
}

const siteSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sailing Plan B',
    url: 'https://sailing-planb.com',
    description: 'Ulrik & Karen sailing the world on a Najad 343',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Main Navigation',
    itemListElement: [
      { '@type': 'SiteNavigationElement', position: 1, name: 'Home', url: 'https://sailing-planb.com/' },
      { '@type': 'SiteNavigationElement', position: 2, name: 'Blog', url: 'https://sailing-planb.com/blog' },
      { '@type': 'SiteNavigationElement', position: 3, name: 'Gallery', url: 'https://sailing-planb.com/gallery' },
      { '@type': 'SiteNavigationElement', position: 4, name: 'About', url: 'https://sailing-planb.com/about' },
      { '@type': 'SiteNavigationElement', position: 5, name: 'Instagram', url: 'https://www.instagram.com/sailing.planb' },
    ],
  },
]

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
