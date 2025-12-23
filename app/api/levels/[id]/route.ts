export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById((session.user as any).id);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const levelKey = `level${params.id}`;
    const levelData = user.levels.get(levelKey);

    if (levelData) {
        try {
            const parsedData = JSON.parse(levelData);
            return NextResponse.json(parsedData);
        } catch (e) {
            console.error("Error parsing level data", e);
            return NextResponse.json({});
        }
    }

    return NextResponse.json({});
}
