export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'GURU') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const users = await User.find({ role: 'SISWA' }).select('-password');
    return NextResponse.json(users);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'GURU') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    const existingUser = await User.findOne({ username: body.username });
    if (existingUser) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const passwordToHash = body.password || "password";
    const hashedPassword = await bcrypt.hash(passwordToHash, 10);

    const newUser = await User.create({
        ...body,
        role: 'SISWA',
        password: hashedPassword,
        levels: {}
    });

    return NextResponse.json(newUser, { status: 201 });
}
