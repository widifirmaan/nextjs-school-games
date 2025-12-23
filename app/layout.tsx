import type { Metadata } from 'next'
import { Nunito, Fredoka } from 'next/font/google'
import './globals.css'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
const fredoka = Fredoka({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-fredoka' })

export const metadata: Metadata = {
    title: 'BukuMedia Game',
    description: 'Interactive Learning Platform',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id">
            <body className={`${nunito.variable} ${fredoka.variable} min-h-screen bg-[#b3e5fc] text-gray-900 font-sans`}>
                {children}
            </body>
        </html>
    )
}
