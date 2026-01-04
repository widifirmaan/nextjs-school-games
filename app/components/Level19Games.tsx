'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import GameAlert from './GameAlert'
import { LEVEL_DATA } from '@/lib/gameData'

interface Level19GamesProps {
    levelId: string;
    onComplete: (data: any) => void;
    initialData?: Record<string, string>;
}

export default function Level19Games({ levelId, onComplete, initialData }: Level19GamesProps) {
    const router = useRouter()

    const levelConfig = LEVEL_DATA[levelId] || { questions: [] }

    const [hasVisited, setHasVisited] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [warning, setWarning] = useState('')

    useEffect(() => {
        if (initialData && initialData['playlist_visited'] === 'true') {
            setHasVisited(true)
        }
    }, [initialData])

    const handleLinkClick = () => {
        window.open('https://music.youtube.com/playlist?list=PLW8_iHPZHpnhgpGRUBk7fwUvoRvartebn', '_blank')
        setHasVisited(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!hasVisited && (!initialData || !initialData['playlist_visited'])) {
            setWarning("Silakan buka playlist terlebih dahulu!")
            return;
        }
        setSubmitting(true)
        // Save dummy data to indicate completion
        onComplete({ playlist_visited: 'true' })
    }

    const isSubmitted = initialData && Object.keys(initialData).length > 0;

    return (
        <>
            <GameAlert isOpen={!!warning} message={warning} onClose={() => setWarning('')} />
            <div className="min-h-screen bg-[#ffebee] py-6 px-4 font-fredoka flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(#ffcdd2 10%, transparent 10%)', backgroundSize: '20px 20px' }}>
                <div className="relative h-[85vh] aspect-[1131/1600] animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)] mx-auto">

                    {/* Decoration */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 w-3/4">
                        <div className="bg-[#d32f2f] text-white py-2 text-center rounded-full border-b-[6px] border-[#b71c1c] shadow-lg">
                            <span className="font-black uppercase tracking-widest text-lg md:text-xl whitespace-nowrap px-4">
                                {levelConfig.title || "LEVEL 19"}
                            </span>
                        </div>
                    </div>

                    <div className="w-full h-full bg-white rounded-[30px] shadow-2xl overflow-hidden border-[8px] border-[#d32f2f] relative">
                        <Image
                            src="/images/level19-bg.jpeg"
                            alt="Level 19 Background"
                            fill
                            className="object-cover pointer-events-none"
                            priority
                        />

                        {/* Center Button Layout */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <button
                                onClick={handleLinkClick}
                                className="group relative bg-white/90 hover:bg-white text-[#d32f2f] text-xl md:text-2xl font-black py-6 px-10 rounded-3xl shadow-2xl border-b-[8px] border-[#b71c1c] active:border-b-0 active:translate-y-2 transition-all transform hover:scale-105"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-1 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                    <span>BUKA PLAYLIST</span>
                                </div>
                                {/* Shine effect */}
                                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                </div>
                            </button>
                        </div>

                        {/* Controls */}
                        {/* Controls - Moved to Top */}
                        {/* Controls - Split */}
                        {/* Top Right: Lanjut */}
                        <div className="absolute top-6 right-4 pointer-events-auto z-30">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || isSubmitted || !hasVisited}
                                className={`rounded-full px-6 py-3 font-bold shadow-lg flex items-center gap-2 border-b-4 transition-all text-sm md:text-base ${(isSubmitted || hasVisited)
                                    ? "bg-[#00c853] hover:bg-[#00e676] text-white border-[#1b5e20] active:border-b-0 active:translate-y-1"
                                    : "bg-gray-400 text-gray-200 border-gray-600 cursor-not-allowed"
                                    }`}
                            >
                                {isSubmitted ? "Sudah Disimpan" : (submitting ? "Menyimpan..." : "Lanjut")}
                            </button>
                        </div>

                        {/* Bottom Left: Kembali */}
                        <div className="absolute bottom-6 left-4 pointer-events-auto z-30">
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard/siswa')}
                                className="bg-white/90 hover:bg-white text-[#d32f2f] rounded-full px-4 py-3 font-bold shadow-lg flex items-center gap-2 border-2 border-[#d32f2f] transition-transform active:scale-95 text-sm md:text-base"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
