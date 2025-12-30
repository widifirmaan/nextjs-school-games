'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import GameAlert from './GameAlert'
import { LEVEL_DATA } from '@/lib/gameData'

interface Level12GamesProps {
    levelId: string;
    onComplete: (data: any) => void;
    initialData?: Record<string, string>;
}

export default function Level12Games({ levelId, onComplete, initialData }: Level12GamesProps) {
    const router = useRouter()

    const levelConfig = LEVEL_DATA[levelId] || { questions: [] }
    const questions = levelConfig.questions || []

    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [warning, setWarning] = useState('')

    useEffect(() => {
        if (initialData) {
            setAnswers(prev => ({
                ...prev,
                ...initialData
            }))
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const allAnswered = questions.every(q => answers[q.id]?.trim());
        if (!allAnswered) {
            setWarning("Silakan isi refleksimu!")
            return;
        }
        setSubmitting(true)
        onComplete(answers)
    }

    const handleChange = (id: string, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [id]: value
        }))
    }

    // Default position: Center, attempting to match a typical mirror size
    const getPositionClass = (id: string) => {
        return "top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[45%] h-[40%]"
    }

    return (
        <>
            <GameAlert isOpen={!!warning} message={warning} onClose={() => setWarning('')} />
            <div className="min-h-screen bg-[#eceff1] py-2 px-4 font-fredoka flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(#cfd8dc 10%, transparent 10%)', backgroundSize: '20px 20px' }}>
                <div className="relative h-[90vh] aspect-[1131/1600] animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)] mx-auto">

                    {/* Decoration */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 w-3/4">
                        <div className="bg-[#78909c] text-[#fff] py-2 text-center rounded-full border-b-[6px] border-[#546e7a] shadow-lg">
                            <span className="font-black uppercase tracking-widest text-lg md:text-xl whitespace-nowrap px-4">
                                {levelConfig.title || "LEVEL 12"}
                            </span>
                        </div>
                    </div>

                    <div className="w-full h-full bg-white rounded-[30px] shadow-2xl overflow-hidden border-[8px] border-[#78909c] relative">
                        <Image
                            src="/images/level12-bg.jpeg"
                            alt="Level 12 Background"
                            fill
                            className="object-cover pointer-events-none"
                            priority
                        />

                        {/* Form Overlay */}
                        <form onSubmit={handleSubmit} className="absolute inset-0 z-10">
                            {questions.map((q) => (
                                <div
                                    key={q.id}
                                    className={`absolute ${getPositionClass(q.id)}`}
                                >
                                    <textarea
                                        value={answers[q.id] || ''}
                                        onChange={(e) => handleChange(q.id, e.target.value)}
                                        className="w-full h-full bg-transparent border-none rounded-[3rem] px-6 py-8 text-center font-bold text-[#263238] text-sm md:text-base focus:outline-none focus:ring-0 transition-all placeholder-gray-600/60 leading-relaxed resize-none flex items-center justify-center"
                                        placeholder="Apa yang kamu lihat di cermin?"
                                    />
                                </div>
                            ))}

                            {/* Controls */}
                            <div className="absolute bottom-6 left-4 right-4 flex justify-between items-center pointer-events-auto">
                                <button
                                    type="button"
                                    onClick={() => router.push('/dashboard/siswa')}
                                    className="bg-white/90 hover:bg-white text-[#455a64] rounded-full px-4 py-3 font-bold shadow-lg flex items-center gap-2 border-2 border-[#455a64] transition-transform active:scale-95 text-sm md:text-base"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    Kembali
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting || (initialData && Object.keys(initialData).length > 0)}
                                    className="bg-[#29b6f6] hover:bg-[#4fc3f7] text-white rounded-full px-6 py-3 font-bold shadow-lg flex items-center gap-2 border-b-4 border-[#0288d1] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                >
                                    {(initialData && Object.keys(initialData).length > 0) ? "Sudah Disimpan" : (submitting ? "Menyimpan..." : "Simpan")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
