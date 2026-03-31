export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"
import { revalidatePath } from 'next/cache';
import { CHAPTER_MAPPING } from '@/lib/gameData';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { level, data } = await req.json();

    await dbConnect();

    const user = await User.findById((session.user as any).id);

    if (!user) {
        console.error("Submit Level Error: User not found for ID", (session.user as any).id);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const levelKey = `level${level}`;
    // Store as stringified JSON to match legacy behavior
    const jsonString = JSON.stringify(data);

    // Using Map for levels
    user.levels.set(levelKey, jsonString);

    // --- AWARDING LOGIC ---
    if (!user.awards) user.awards = [];
    if (!user.newAwardsToNotify) user.newAwardsToNotify = [];
    if (!user.dailySubmissions) user.dailySubmissions = new Map();

    const today = new Date().toISOString().split('T')[0];
    const currentCount = user.dailySubmissions.get(today) || 0;
    user.dailySubmissions.set(today, currentCount + 1);

    // Consistent Worker Logic (7 consecutive days of >= 1 submission)
    if (!user.awards.includes('CONSISTENT_WORKER')) {
        let streak = 0;
        let d = new Date();
        for (let i = 0; i < 7; i++) {
            const dateStr = d.toISOString().split('T')[0];
            if (user.dailySubmissions.get(dateStr) && user.dailySubmissions.get(dateStr) > 0) {
                streak++;
            }
            d.setDate(d.getDate() - 1);
        }
        if (streak === 7) {
            user.awards.push('CONSISTENT_WORKER');
            user.newAwardsToNotify.push('CONSISTENT_WORKER');
        }
    }

    // Fastest Worker per Category Logic
    const levelNum = parseInt(level);
    let currentIndukId = "";
    let isLastLevelOfInduk = false;

    for (const [id, levelList] of Object.entries(CHAPTER_MAPPING)) {
        if (levelList.includes(levelNum)) {
            currentIndukId = id;
            isLastLevelOfInduk = levelList[levelList.length - 1] === levelNum;
            break;
        }
    }

    if (currentIndukId && isLastLevelOfInduk) {
        const indukId = currentIndukId;
        if (!user.indukEndTimes) user.indukEndTimes = new Map();
        if (!user.indukEndTimes.has(indukId)) {
            user.indukEndTimes.set(indukId, new Date());
            
            // Calculate time taken
            const startTimeString = user.indukStartTimes?.get(indukId);
            if (startTimeString) {
                const startTime = new Date(startTimeString);
                const endTime = new Date();
                const diffMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

                // If completed under 15 minutes, grant fastest worker for this induk
                const fastAwardKey = `FAST_WORKER_INDUK_${indukId}`;
                if (diffMinutes < 15 && !user.awards.includes(fastAwardKey)) {
                    user.awards.push(fastAwardKey);
                    user.newAwardsToNotify.push(fastAwardKey);
                }
            }
        }
    }
    // --- END AWARDING LOGIC ---

    await user.save();

    revalidatePath('/dashboard/siswa');

    return NextResponse.json({ message: 'Level submitted' });
}
