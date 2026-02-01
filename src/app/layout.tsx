import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather'
})

export const metadata: Metadata = {
  title: 'EconIntuition - Economia Formal Hecha Intuitiva',
  description: 'Plataforma educativa interactiva para aprender economia con visualizaciones, animaciones y modelos interactivos.',
  keywords: ['economia', 'microeconomia', 'macroeconomia', 'educacion', 'interactivo', 'IS-LM', 'oferta', 'demanda'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  )
}
