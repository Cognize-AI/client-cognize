import type { Metadata } from 'next'
import { Inter_Tight } from 'next/font/google'
import './globals.scss'
import { TagsStoreProvider } from '@/provider/tags-store-provider'
import { UserStoreProvider } from '@/provider/user-store-provider'
import { CardStoreProvider } from '@/provider/card-store-provider'

const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Cognize – Simple AI-powered CRM',
  description:
    'Cognize is a simple, AI-powered CRM for startups, freelancers, and small teams. Organize contacts, manage leads, and qualify opportunities with smart tags and a clean, modern interface.',
  keywords: [
    'AI contact manager',
    'simple CRM tool',
    'lightweight CRM for startups',
    'lead management software',
    'AI-powered CRM platform',
    'contact organization tool',
    'CRM for freelancers',
    'CRM for solopreneurs',
    'affordable CRM for small business',
    'personal CRM for networking'
  ],
  icons: {
    icon: '/favicon.svg'
  },
  openGraph: {
    title: 'Cognize: To know and understand your contacts.',
    description:
      'Cognize is a simple, AI-powered CRM for startups, freelancers, and small teams.',
    url: 'https://client-cognize.vercel.app',
    siteName: 'Cognize',
    images: [
      {
        url: 'https://client-cognize.vercel.app/og-image.png',
        width: 1200,
        height: 630
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cognize – Simple AI-powered CRM',
    description:
      'Cognize is a simple, AI-powered CRM for startups, freelancers, and small teams.',
    images: ['https://client-cognize.vercel.app/og-image.png']
  }
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${interTight.variable}`}>
        <UserStoreProvider>
          {/* <HeaderWrapper /> */}
          <TagsStoreProvider>
              <CardStoreProvider>
                {children}
              </CardStoreProvider>
          </TagsStoreProvider>
        </UserStoreProvider>
      </body>
    </html>
  )
}
