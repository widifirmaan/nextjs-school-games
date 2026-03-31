'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { CHAPTER_NAMES, CHAPTER_MAPPING } from '@/lib/gameData'

interface StudentDashboardProps {
    user: any;
    completedLevels: string[];
}

export default function StudentDashboardClient({ user, completedLevels }: StudentDashboardProps) {
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
    const [currentAwardQueue, setCurrentAwardQueue] = useState<string[]>(user.newAwardsToNotify || []);

    const dismissAward = async (award: string) => {
        setCurrentAwardQueue(prev => prev.filter(a => a !== award));
        try {
            await fetch('/api/awards/clear', {
                method: 'POST',
                body: JSON.stringify({ award }),
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (e) {
            console.error("Failed to dismiss award", e);
        }
    };

    const formatAwardName = (award: string) => {
        if (award === 'CONSISTENT_WORKER') return '🏆 Pekerja Konsisten (7 Hari)';
        if (award.startsWith('FAST_WORKER_INDUK_')) {
            const id = award.replace('FAST_WORKER_INDUK_', '');
            return `⚡ Tercepat Induk ${id}`;
        }
        return award;
    };

    const levels = Array.from({ length: 30 }, (_, i) => i + 1);
    const chapters = Object.keys(CHAPTER_NAMES).map(Number);
    const chapterNames = CHAPTER_NAMES;

    // Find the first level that hasn't been completed yet
    const firstIncompleteLevel = levels.find(l => !completedLevels.includes(`level${l}`)) || levels.length + 1;

    // Check if level is unlocked
    // Rule: Unlocked if it's already completed OR if it's the specific next step (filling the gap)
    const isLevelUnlocked = (level: number) => {
        return completedLevels.includes(`level${level}`) || level === firstIncompleteLevel;
    };

    const isLevelCompleted = (level: number) => {
        return completedLevels.includes(`level${level}`);
    };

    const getChapterLevels = (chapter: number) => {
        return CHAPTER_MAPPING[chapter] || [];
    };

    const isChapterUnlocked = (chapter: number) => {
        const chapterLevels = getChapterLevels(chapter);
        if (chapterLevels.length === 0) return false;
        // Unlocked if first level is unlocked
        return isLevelUnlocked(chapterLevels[0]);
    };

    const getChapterProgressText = (chapter: number) => {
        const chapterLevels = getChapterLevels(chapter);
        if (chapterLevels.length === 0) return '0/0 Selesai';
        const completedCount = chapterLevels.filter(l => isLevelCompleted(l)).length;
        return `${completedCount}/${chapterLevels.length} Selesai`;
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        signOut({ callbackUrl: '/login' });
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto p-4 md:p-8 font-fredoka">
            {/* Main Game Panel Container */}
            <div className="relative mt-8">

                {/* Floating "LEVEL SELECT" Ribbon */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-[#ffca28] text-[#3e2723] px-12 py-3 rounded-full border-b-[6px] border-[#f57f17] shadow-[0_8px_0_rgba(0,0,0,0.2)]">
                        <h1 className="text-3xl font-black uppercase tracking-wider" style={{ textShadow: '2px 2px 0 rgba(255,255,255,0.5)' }}>
                            Dimensi PWB
                        </h1>
                    </div>
                </div>

                {/* Chocolate Panel */}
                <div className="bg-[#3e2723] rounded-[40px] border-[10px] border-[#304ffe] shadow-2xl p-8 pt-16 flex flex-col xl:flex-row gap-8 min-h-[700px]">

                    {/* Left Column: Profile Card */}
                    <div className="w-full xl:w-[350px] flex-shrink-0 flex flex-col gap-6">
                        <div className="bg-[#261815]/50 rounded-3xl border-2 border-dashed border-white/20 p-6 flex flex-col items-center h-full relative">

                            {/* Avatar */}
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-white mb-4 overflow-hidden shadow-lg relative">
                                {user.photoUrl ? (
                                    <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                                {/* Online Status Dot */}
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>

                            {/* Greeting */}
                            <h2 className="text-2xl font-bold text-white mb-8 text-center">
                                Hi, {user.fullName || user.username}
                            </h2>

                            {/* Info Cards */}
                            <div className="w-full space-y-4 mb-auto">
                                {/* School Info */}
                                <div className="bg-[#3949ab] rounded-xl p-3 border-l-[6px] border-[#1a237e] shadow-md flex items-center gap-3 text-white relative group transition-transform hover:scale-105">
                                    <div className="p-2 bg-[#1a237e] rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center text-xs font-bold text-blue-200 uppercase tracking-widest mb-0.5">
                                            <span>Sekolah</span>
                                            <span>Kelas</span>
                                        </div>
                                        <div className="flex justify-between items-center font-bold text-sm truncate">
                                            <span className="truncate mr-2">{user.schoolName || '-'}</span>
                                            <span className="bg-[#1a237e] px-2 py-0.5 rounded text-yellow-400">{user.kelas || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Email Info */}
                                <div className="bg-[#3949ab] rounded-xl p-3 border-l-[6px] border-[#1a237e] shadow-md flex items-center gap-3 text-white relative group transition-transform hover:scale-105">
                                    <div className="p-2 bg-[#1a237e] rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center text-xs font-bold text-blue-200 uppercase tracking-widest mb-0.5">
                                            <span>Email</span>
                                            <span>Role</span>
                                        </div>
                                        <div className="flex justify-between items-center font-bold text-sm truncate">
                                            <span className="truncate mr-2">{user.email || '-'}</span>
                                            <span className="bg-[#1a237e] px-2 py-0.5 rounded text-yellow-400">Siswa</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full mt-6 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold py-3 rounded-full border-b-4 border-[#8b0000] shadow-lg active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 uppercase tracking-wide group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Level Grid */}
                    <div className="flex-1 flex flex-col max-h-[700px]">

                        {/* Breadcrumbs / Back button */}
                        {selectedChapter !== null && (
                            <div className="mb-4 flex items-center justify-between">
                                <button 
                                    onClick={() => setSelectedChapter(null)}
                                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors border-2 border-white/20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    Kembali ke Menu Utama
                                </button>
                                <div className="text-white font-black text-xl bg-[#1a237e] px-4 py-1.5 rounded-full border-2 border-[#5c6bc0]">
                                    {chapterNames[selectedChapter]}
                                </div>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                            {selectedChapter === null ? (
                                /* Chapters Grid */
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {chapters.map((chapter) => {
                                        const unlocked = isChapterUnlocked(chapter);
                                        const progressText = getChapterProgressText(chapter);
                                        
                                        return (
                                            <div key={chapter} className="relative group cursor-pointer" onClick={() => unlocked && setSelectedChapter(chapter)}>
                                                <div className={`
                                                    aspect-[4/3] rounded-2xl flex flex-col items-center justify-between p-5 transition-all duration-300
                                                    ${unlocked
                                                        ? 'bg-[#3949ab] border-[6px] border-[#5c6bc0] shadow-[0_8px_0_#1a237e] hover:-translate-y-2 hover:shadow-[0_12px_0_#1a237e]'
                                                        : 'bg-[#424242] border-[6px] border-[#616161] shadow-[0_8px_0_#212121] opacity-90'
                                                    }
                                                `}>
                                                    {/* Header */}
                                                    <div className="w-full flex justify-between items-start">
                                                        {unlocked ? (
                                                            <div className="bg-[#1a237e] px-3 py-1 rounded-lg text-yellow-400 font-bold text-sm shadow-inner">
                                                                {progressText}
                                                            </div>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                        
                                                        {unlocked && (
                                                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Title */}
                                                    <div className="flex flex-col items-center mt-2 text-center">
                                                        <span className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">
                                                            Kategori {chapter}
                                                        </span>
                                                        <span className={`text-xl md:text-2xl font-black leading-tight ${unlocked ? 'text-white' : 'text-gray-500'}`}>
                                                            {chapterNames[chapter]}
                                                        </span>
                                                    </div>

                                                    {/* Action Button/Status */}
                                                    <div className="w-full mt-4">
                                                        {unlocked ? (
                                                            <div className="w-full bg-[#ffca28] group-hover:bg-[#ffb300] text-[#3e2723] text-sm font-black py-2.5 rounded-lg border-b-4 border-[#f57f17] text-center uppercase tracking-wide transition-colors">
                                                                Pilih Kategori
                                                            </div>
                                                        ) : (
                                                            <div className="w-full bg-[#616161] text-gray-400 text-xs font-bold py-2.5 rounded-lg border-b-4 border-[#424242] text-center uppercase">
                                                                Terkunci
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                /* Child Levels Grid */
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {getChapterLevels(selectedChapter).map((level) => {
                                        const unlocked = isLevelUnlocked(level);
                                        const completed = isLevelCompleted(level);

                                        return (
                                            <div key={level} className="relative group">
                                                <div className={`
                                                    aspect-[4/5] rounded-xl flex flex-col items-center justify-between p-3 transition-all duration-300
                                                    ${unlocked
                                                        ? 'bg-[#3949ab] border-4 border-[#5c6bc0] shadow-[0_6px_0_#1a237e] hover:-translate-y-1'
                                                        : 'bg-[#424242] border-4 border-[#616161] shadow-[0_6px_0_#212121] opacity-90'
                                                    }
                                                `}>
                                                    {/* Stars/Lock Header */}
                                                    <div className="h-8 flex items-center justify-center w-full">
                                                        {unlocked ? (
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3].map(star => (
                                                                    <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${completed ? 'text-yellow-400' : 'text-gray-400/50'}`} viewBox="0 0 20 20" fill="currentColor">
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>

                                                    {/* Level Number */}
                                                    <div className="flex flex-col items-center">
                                                        <span className={`text-sm font-black uppercase tracking-widest ${unlocked ? 'text-blue-200' : 'text-gray-400'}`}>
                                                            LVL {level}
                                                        </span>
                                                    </div>

                                                    {/* Action Button/Status */}
                                                    <div className="w-full">
                                                        {unlocked ? (
                                                            <Link href={`/level/${level}`} className="block w-full">
                                                                <button className="w-full bg-[#ffca28] hover:bg-[#ffb300] text-[#3e2723] text-xs font-black py-2 rounded-lg border-b-4 border-[#f57f17] active:border-b-0 active:translate-y-1 transition-all shadow-md group-hover:shadow-lg uppercase">
                                                                    Play
                                                                </button>
                                                            </Link>
                                                        ) : (
                                                            <div className="w-full bg-[#616161] text-gray-400 text-[10px] font-bold py-2 rounded-lg border-b-4 border-[#424242] text-center uppercase cursor-not-allowed">
                                                                Lock
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm grid place-items-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="w-full max-w-sm relative animate-[popIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                        <button
                            onClick={() => setShowLogoutModal(false)}
                            className="absolute -top-4 -right-4 bg-yellow-400 hover:bg-yellow-300 text-red-600 border-4 border-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg z-50 hover:scale-110 active:scale-95 transition-transform"
                            style={{ boxShadow: '0 4px 0 #f57f17' }}
                        >
                            X
                        </button>

                        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border-8 border-red-500">
                            <div className="bg-red-500 p-4 text-center border-b-4 border-red-700">
                                <h3 className="text-2xl font-black text-white font-fredoka uppercase tracking-wider text-[shadow:2px_2px_0_#000]">
                                    KELUAR?
                                </h3>
                            </div>

                            <div className="p-8 text-center bg-red-50">
                                <p className="text-gray-800 font-bold text-lg mb-2">Apakah Anda yakin ingin keluar?</p>
                            </div>

                            <div className="bg-gray-100 p-5 flex justify-center gap-4">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-bold shadow-md transition-transform active:scale-95 border-b-4 border-gray-700"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold shadow-md transition-transform active:scale-95 border-b-4 border-red-700"
                                >
                                    Ya, Keluar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Awards Modal */}
            {currentAwardQueue.length > 0 && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm grid place-items-center z-50 p-4 animate-[fadeIn_0.5s_ease-out]">
                    <div className="w-full max-w-md relative bg-gradient-to-b from-[#ffca28] to-[#f57f17] rounded-3xl p-8 border-8 border-white shadow-2xl text-center transform animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-6xl drop-shadow-lg">
                            🎉
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-widest drop-shadow-md mb-2">
                            PENGHARGAAN BARU!
                        </h2>
                        <p className="text-white text-lg font-bold mb-6 drop-shadow-sm">Selamat {user.fullName}, kamu mendapatkan pencapaian:</p>
                        
                        <div className="bg-white/20 rounded-2xl p-6 mb-8 border-4 border-white/30 backdrop-blur-sm">
                            <span className="text-2xl font-black text-white drop-shadow-md relative z-10 text-[shadow:1px_1px_0_#000]">
                                {formatAwardName(currentAwardQueue[0])}
                            </span>
                        </div>

                        <button 
                            onClick={() => dismissAward(currentAwardQueue[0])}
                            className="bg-white text-[#f57f17] px-8 py-3 rounded-full font-black uppercase tracking-wider text-lg shadow-[0_6px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-[0_2px_0_rgba(0,0,0,0.2)] transition-all hover:bg-gray-100"
                        >
                            Luar Biasa!
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}
