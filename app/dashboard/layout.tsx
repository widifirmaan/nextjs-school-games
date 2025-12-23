import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import Link from 'next/link'
import GameLogoutButton from '@/app/components/GameLogoutButton'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen flex flex-col font-nunito">
            {/* Game Themed Navigation */}
            <nav className="bg-[#3e2723] border-b-8 border-[#1a237e] shadow-lg z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-24">
                        <div className="flex items-center gap-4">
                            {/* Logo/Title */}
                            <div className="flex-shrink-0">
                                <Link href="/dashboard">
                                    <h1 className="text-4xl font-bold font-fredoka text-[#ffca28]" style={{ textShadow: '3px 3px 0 #000' }}>
                                        BukuMedia
                                    </h1>
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* User Info */}
                            <div className="hidden md:flex flex-col items-end text-white">
                                <span className="font-bold text-xl font-fredoka" style={{ textShadow: '2px 2px 0 #000' }}>
                                    Hi, {session.user?.name || 'Guest'}
                                </span>
                            </div>

                            {/* Logout Button */}
                            <GameLogoutButton />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-[1600px] mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    )
}
