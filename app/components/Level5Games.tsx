'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import GameAlert from './GameAlert'
import { LEVEL_DATA } from '@/lib/gameData'

interface Level5GamesProps {
    levelId: string;
    onComplete: (data: any) => void;
    initialData?: Record<string, string>;
}

export default function Level5Games({ levelId, onComplete, initialData }: Level5GamesProps) {
    const router = useRouter()

    // Default to empty array if undefined
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
            setWarning("Silakan isi semua elixir!")
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

    // Helper for positions
    const getPositionClass = (id: string) => {
        // Using center-based positioning with translate to ensure they are centered in the bowls
        const baseClass = "transform -translate-x-1/2 -translate-y-1/2";
        switch (id) {
            case 'elixir_1': return `${baseClass} top-[30%] left-[28%] w-[15%] h-[12%]`;
            case 'elixir_2': return `${baseClass} top-[45%] left-[68%] w-[17%] h-[13%]`;
            case 'elixir_3': return `${baseClass} top-[61%] left-[28%] w-[17%] h-[13%]`;
            case 'elixir_4': return `${baseClass} top-[84%] left-[71%] w-[16%] h-[12%]`;
            default: return "top-1/2 left-1/2";
        }
    }

    return (
        <>
            <GameAlert isOpen={!!warning} message={warning} onClose={() => setWarning('')} />
            <div className="min-h-screen bg-[#e1f5fe] py-2 px-4 font-fredoka flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(#b3e5fc 10%, transparent 10%)', backgroundSize: '20px 20px' }}>
                {/* Main Container */}
                <div className="relative h-[90vh] aspect-[1131/1600] animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)] mx-auto">

                    {/* Decoration */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 w-3/4">
                        <div className="bg-[#4fc3f7] text-[#01579b] py-2 text-center rounded-full border-b-[6px] border-[#0288d1] shadow-lg">
                            <span className="font-black uppercase tracking-widest text-lg md:text-xl whitespace-nowrap px-4">
                                {levelConfig.title || "LEVEL 5"}
                            </span>
                        </div>
                    </div>

                    {/* Card Container */}
                    <div className="w-full h-full bg-white rounded-[30px] shadow-2xl overflow-hidden border-[8px] border-[#4fc3f7] relative">

                        <Image
                            src="/images/level5-bg.jpeg"
                            alt="Level 5 Background"
                            fill
                            className="object-cover"
                            priority
                        />

                        {/* Form Overlay */}
                        <form onSubmit={handleSubmit} className="absolute inset-0 z-10">

                            {/* Dynamic Questions Inputs Positioned relative to image */}
                            {questions.map((q) => (
                                <div
                                    key={q.id}
                                    className={`absolute ${getPositionClass(q.id)}`}
                                >
                                    <textarea
                                        value={answers[q.id] || ''}
                                        onChange={(e) => handleChange(q.id, e.target.value)}
                                        className="w-full h-full bg-white/40 backdrop-blur-[2px] border-none rounded-xl px-2 py-1 text-center font-bold text-[#0277bd] text-xs md:text-sm focus:outline-none focus:bg-white/80 transition-all placeholder-[#0288d1]/40 leading-tight resize-none shadow-sm"
                                        placeholder="..."
                                    />
                                </div>
                            ))}

                            {/* Action Buttons */}
                            <div className="absolute bottom-6 left-4 right-4 flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={() => router.push('/dashboard/siswa')}
                                    className="bg-white/90 hover:bg-white text-[#01579b] rounded-full px-4 py-3 font-bold shadow-lg flex items-center gap-2 border-2 border-[#01579b] transition-transform active:scale-95 text-sm md:text-base"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    Kembali
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting || (initialData && Object.keys(initialData).length > 0)}
                                    className="bg-[#00c853] hover:bg-[#00e676] text-white rounded-full px-6 py-3 font-bold shadow-lg flex items-center gap-2 border-b-4 border-[#1b5e20] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            ...
                                        </>
                                    ) : (
                                        <>
                                            Simpan
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
