export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'GURU') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    const updateData = { ...body };
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
        delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(params.id, updateData, { new: true }).select('-password');
    return NextResponse.json(updatedUser);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'GURU') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    await User.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'User deleted' });
}
