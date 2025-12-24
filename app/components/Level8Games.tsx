'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import GameAlert from './GameAlert'
import { LEVEL_DATA } from '@/lib/gameData'

interface Level8GamesProps {
    levelId: string;
    onComplete: (data: any) => void;
    initialData?: Record<string, string>;
}

export default function Level8Games({ levelId, onComplete, initialData }: Level8GamesProps) {
    const router = useRouter()

    const levelConfig = LEVEL_DATA[levelId] || { questions: [] }
    const questions = levelConfig.questions || []
    // Assuming single question
    const qId = questions[0]?.id || 'reflection'

    const [answer, setAnswer] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [warning, setWarning] = useState('')

    useEffect(() => {
        if (initialData && initialData[qId]) {
            setAnswer(initialData[qId])
        }
    }, [initialData, qId])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!answer.trim()) {
            setWarning("Silakan isi jawabanmu!")
            return;
        }
        setSubmitting(true)
        onComplete({ [qId]: answer })
    }

    return (
        <>
            <GameAlert isOpen={!!warning} message={warning} onClose={() => setWarning('')} />
            <div className="min-h-screen bg-[#fff8e1] py-2 px-4 font-fredoka flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(#ffecb3 10%, transparent 10%)', backgroundSize: '20px 20px' }}>
                <div className="relative h-[90vh] aspect-[899/1599] animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)] mx-auto">

                    {/* Decoration */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 w-3/4">
                        <div className="bg-[#ffab91] text-[#bf360c] py-2 text-center rounded-full border-b-[6px] border-[#d84315] shadow-lg">
                            <span className="font-black uppercase tracking-widest text-lg md:text-xl whitespace-nowrap px-4">
                                {levelConfig.title || "LEVEL 8"}
                            </span>
                        </div>
                    </div>

                    <div className="w-full h-full bg-white rounded-[30px] shadow-2xl overflow-hidden border-[8px] border-[#ffab91] relative">
                        <Image
                            src="/images/level8-bg.jpeg"
                            alt="Level 8 Background"
                            fill
                            className="object-cover pointer-events-none"
                            priority
                        />

                        {/* Form Overlay */}
                        <form onSubmit={handleSubmit} className="absolute inset-0 z-10">

                            {/* Large Transparent Input Area */}
                            {/* Positioning based on "di bawah text" - assuming text is top half */}
                            <div className="absolute top-[40%] left-[8%] right-[8%] bottom-[20%]">
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className="w-full h-full bg-transparent border-none p-6 text-center font-bold text-[#3e2723] text-lg md:text-xl focus:outline-none focus:bg-white/10 rounded-3xl resize-none placeholder-[#5d4037]/40 leading-relaxed transition-colors"
                                    placeholder="Tuliskan jawabanmu di sini..."
                                    style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}
                                />
                            </div>

                            {/* Controls */}
                            <div className="absolute bottom-6 left-4 right-4 flex justify-between items-center pointer-events-auto">
                                <button
                                    type="button"
                                    onClick={() => router.push('/dashboard/siswa')}
                                    className="bg-white/90 hover:bg-white text-[#bf360c] rounded-full px-4 py-3 font-bold shadow-lg flex items-center gap-2 border-2 border-[#bf360c] transition-transform active:scale-95 text-sm md:text-base"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    Kembali
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-[#00c853] hover:bg-[#00e676] text-white rounded-full px-6 py-3 font-bold shadow-lg flex items-center gap-2 border-b-4 border-[#1b5e20] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                >
                                    {submitting ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
