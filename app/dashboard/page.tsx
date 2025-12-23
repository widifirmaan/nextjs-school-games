export const dynamic = 'force-dynamic'

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const role = (session.user as any).role

    if (role === 'GURU') {
        redirect('/dashboard/guru')
    } else if (role === 'SISWA') {
        redirect('/dashboard/siswa')
    }

    return (
        <div>Redirecting...</div>
    )
}
