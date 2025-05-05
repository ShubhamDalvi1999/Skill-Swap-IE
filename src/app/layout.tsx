import type { Metadata } from 'next'
import React from 'react'
import './globals.css'
import { Inter, Poppins, JetBrains_Mono, VT323 } from 'next/font/google'
import Providers from '@/components/Providers'
import ErrorBoundary from '@/components/shared/ErrorBoundary'

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

const vt323 = VT323({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-vt323',
})

export const metadata = {
  title: 'SkillSwap - Learn, Practice, Build',
  description: 'A modern platform for online learning, designed to help you master new skills and advance your career.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} ${vt323.variable}`}>
      <body className="font-sans bg-secondary-950 text-white">
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
} 