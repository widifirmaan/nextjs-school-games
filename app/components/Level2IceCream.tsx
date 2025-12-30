'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import GameAlert from './GameAlert'

interface Level2IceCreamProps {
    levelId: string;
    onComplete: (data: any) => void;
    initialData?: Record<string, string>;
}

export default function Level2IceCream({ levelId, onComplete, initialData }: Level2IceCreamProps) {
    const router = useRouter()
    const [answers, setAnswers] = useState({
        harapan: ''
    })
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
        if (!answers.harapan?.trim()) {
            setWarning("Silakan isi harapanmu terlebih dahulu!")
            return;
        }
        setSubmitting(true)
        onComplete(answers)
    }

    const handleChange = (value: string) => {
        setAnswers({ harapan: value })
    }

    return (
        <>
            <GameAlert isOpen={!!warning} message={warning} onClose={() => setWarning('')} />
            <div className="min-h-screen bg-[#b3e5fc] py-2 px-4 font-fredoka flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(#90caf9 10%, transparent 10%)', backgroundSize: '20px 20px' }}>
                {/* Main Container - constrained by height to fit screen */}
                <div className="relative h-[90vh] aspect-[9/16] animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)] mx-auto">

                    {/* Decoration Ribbon */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 w-3/4">
                        <div className="bg-[#ffca28] text-[#3e2723] py-2 text-center rounded-full border-b-[6px] border-[#f57f17] shadow-lg">
                            <span className="font-black uppercase tracking-widest text-lg md:text-xl whitespace-nowrap px-4">
                                SCOOP OF HOPE
                            </span>
                        </div>
                    </div>

                    {/* Card Container - Image fills this */}
                    <div className="w-full h-full bg-[#3e2723] rounded-[30px] shadow-2xl overflow-hidden border-[8px] border-[#304ffe] relative">

                        <Image
                            src="/images/level2-bg.jpeg"
                            alt="Scoop of Hope"
                            fill
                            className="object-cover"
                            priority
                        />

                        {/* Form Overlay */}
                        <form onSubmit={handleSubmit} className="absolute inset-0 z-10">

                            {/* Single Input Area - Centered over the scoops */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-[40%] w-[65%] h-[40%]">
                                <textarea
                                    value={answers.harapan}
                                    onChange={(e) => handleChange(e.target.value)}
                                    className="w-full h-full bg-transparent border-none text-center text-[#5D4037] font-bold text-sm md:text-xl resize-none focus:ring-0 placeholder-blue-600 leading-relaxed"
                                    placeholder="Tuliskan harapan dan doamu di sini..."
                                    style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}
                                />
                            </div>

                            {/* Action Buttons Overlay */}

                            {/* Back Button - Bottom Left */}
                            <div className="absolute bottom-6 left-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/dashboard/siswa')}
                                    className="bg-white/90 hover:bg-white text-[#3e2723] rounded-full px-4 py-3 font-bold shadow-lg flex items-center gap-2 border-2 border-[#3e2723] transition-transform active:scale-95 text-sm md:text-base"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    Kembali
                                </button>
                            </div>

                            {/* Save Button - Bottom Right */}
                            <div className="absolute bottom-6 right-4">
                                <button
                                    type="submit"
                                    disabled={submitting || (initialData && Object.keys(initialData).length > 0)}
                                    className="px-8 py-3 bg-[#ff4081] hover:bg-[#f50057] text-white rounded-full font-bold shadow-lg transform transition active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
