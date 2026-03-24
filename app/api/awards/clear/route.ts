export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { award } = await req.json();
    if (!award) return NextResponse.json({ error: 'No award specified' }, { status: 400 });

    await dbConnect();
    const user = await User.findById((session.user as any).id);
    if (user && user.newAwardsToNotify) {
        user.newAwardsToNotify = user.newAwardsToNotify.filter((a: string) => a !== award);
        await user.save();
    }
    return NextResponse.json({ success: true });
}
