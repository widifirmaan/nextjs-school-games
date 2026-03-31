export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"
import { CHAPTER_MAPPING } from '@/lib/gameData';

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

    const levelId = params.id;
    const levelNum = parseInt(levelId);
    let currentIndukId = "";
    for (const [id, levels] of Object.entries(CHAPTER_MAPPING)) {
        if (levels.includes(levelNum)) {
            currentIndukId = id;
            break;
        }
    }
    const indukId = currentIndukId || Math.ceil(levelNum / 5).toString();

    if (!user.indukStartTimes) user.indukStartTimes = new Map();
    if (!user.indukStartTimes.has(indukId)) {
        user.indukStartTimes.set(indukId, new Date());
        await user.save();
    }

    const levelKey = `level${levelId}`;
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
