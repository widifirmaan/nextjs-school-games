export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"
import { revalidatePath } from 'next/cache';

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
    await user.save();

    revalidatePath('/dashboard/siswa');

    return NextResponse.json({ message: 'Level submitted' });
}
