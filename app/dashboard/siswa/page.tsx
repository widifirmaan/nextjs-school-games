import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import User from "@/lib/models/User"
import dbConnect from "@/lib/mongodb"
import StudentDashboardClient from "./StudentDashboardClient"

export const dynamic = 'force-dynamic'

export default async function SiswaDashboard() {
    const session = await getServerSession(authOptions)
    await dbConnect()

    const user = await User.findById((session?.user as any).id)

    // Serialize user data for Client Component
    const serializedUser = {
        name: user?.name, // Fallback if needed, though session usually has it
        fullName: user?.fullName || user?.username,
        username: user?.username,
        email: user?.email,
        level: user?.level || 1, // Default or fetched
        schoolName: user?.schoolName,
        kelas: user?.kelas,
        photoUrl: user?.photoUrl,
        // ... any other needed fields
    }

    // Parse levels from the Map/JSON string structure
    const completedLevels: string[] = []
    if (user && user.levels) {
        try {
            for (const key of user.levels.keys()) {
                completedLevels.push(key)
            }
        } catch (e) {
            // fallback
        }
    }

    return (
        <StudentDashboardClient
            user={serializedUser}
            completedLevels={completedLevels}
        />
    )
}
