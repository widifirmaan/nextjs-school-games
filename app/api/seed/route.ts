import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
    await dbConnect();

    try {
        // 1. Create Guru
        const existingGuru = await User.findOne({ username: 'guru' });
        if (!existingGuru) {
            const hashedPassword = await bcrypt.hash('password', 10);
            await User.create({
                username: 'guru',
                password: hashedPassword,
                role: 'GURU',
                fullName: 'Budi Guru',
                email: 'guru@sekolah.id',
                schoolName: 'SMA Negeri 1',
                photoUrl: 'https://i.pravatar.cc/150?u=guru'
            });
            console.log('User guru created');
        }

        // 2. Create Siswa
        const existingSiswa = await User.findOne({ username: 'siswa' });
        if (!existingSiswa) {
            const hashedPassword = await bcrypt.hash('password', 10);
            const siswa = await User.create({
                username: 'siswa',
                password: hashedPassword,
                role: 'SISWA',
                fullName: 'Ani Siswa',
                email: 'siswa@sekolah.id',
                kelas: 'XII-A',
                schoolName: 'SMA Negeri 1',
                photoUrl: 'https://i.pravatar.cc/150?u=siswa',
                levels: {}
            });

            // Add sample level data matching Java DataInitializer
            siswa.levels.set("level1", JSON.stringify({
                "Siapakah_presiden_pertama_Indonesia?": "Soekarno",
                "Apa_warna_bendera_Indonesia?": "Merah Putih",
                "status": "completed",
                "stars": 3
            }));
            await siswa.save();
            console.log('User siswa created');
        }

        return NextResponse.json({ message: 'Database seeded successfully. You can now login.' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
    }
}
