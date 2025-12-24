'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LEVEL_DATA } from '@/lib/gameData'
import Level1WordSearch from '@/app/components/Level1WordSearch'
import Level2IceCream from '@/app/components/Level2IceCream'

export default function LevelPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const levelId = params.id
    const levelConfig = LEVEL_DATA[levelId]
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchLevelData = async () => {
            try {
                const res = await fetch(`/api/levels/${levelId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setAnswers(data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch level data", error);
            }
        };

        fetchLevelData();
    }, [levelId]);

    if (!levelConfig) {
        return <div className="p-10 text-center">Level not found</div>
    }

    const handleSubmit = async (e: React.FormEvent | any) => {
        // Handle explicit event if coming from form, otherwise handled by component
        if (e && e.preventDefault) e.preventDefault()

        // If it's a component-based submit (like Level 1 & 2), the data comes as argument
        const dataToSubmit = (levelId === '1' || levelId === '2') ? e : answers;

        if (!dataToSubmit && levelId !== '1' && levelId !== '2') {
            if (!confirm("Apakah Anda yakin ingin mengirim jawaban ini?")) return;
        }

        setSubmitting(true)

        // Add status: completed and stars: 3 (hardcoded as per legacy example)
        const payload = {
            ...dataToSubmit,
            status: "completed",
            stars: 3
        }

        const res = await fetch('/api/levels/submit', {
            method: 'POST',
            body: JSON.stringify({ level: levelId, data: payload }),
            headers: { 'Content-Type': 'application/json' }
        })

        if (res.ok) {
            // Force a hard refresh to ensure the dashboard updates immediately, 
            // bypassing Next.js client-side router cache.
            window.location.href = '/dashboard/siswa';
        } else {
            alert("Gagal mengirim jawaban")
        }
        setSubmitting(false)
    }

    if (levelId === '1') {
        return <Level1WordSearch levelId={levelId} onComplete={handleSubmit} initialData={answers} />
    }

    if (levelId === '2') {
        return <Level2IceCream levelId={levelId} onComplete={handleSubmit} initialData={answers} />
    }


    return (
        <div className="min-h-screen bg-[#b3e5fc] py-10 px-4 font-fredoka" style={{ backgroundImage: 'radial-gradient(#90caf9 10%, transparent 10%)', backgroundSize: '20px 20px' }}>
            <div className="max-w-2xl mx-auto relative animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]">

                {/* Decoration Ribbon */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10 w-3/4">
                    <div className="bg-[#ffca28] text-[#3e2723] py-2 text-center rounded-full border-b-[6px] border-[#f57f17] shadow-lg">
                        <span className="font-black uppercase tracking-widest text-lg md:text-xl">
                            Challenge Start!
                        </span>
                    </div>
                </div>

                <div className="bg-[#3e2723] rounded-[30px] shadow-2xl overflow-hidden border-[8px] border-[#304ffe] mt-6">
                    <div className="bg-[#304ffe] p-8 pt-10 text-center border-b-[6px] border-[#1a237e] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_10%,_transparent_10%)] bg-[length:20px_20px]"></div>
                        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider text-[shadow:3px_3px_0_#000] relative z-10">
                            {levelConfig.title}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 bg-[#4e342e]">
                        {levelConfig.questions.map((q, idx) => (
                            <div key={q.id} className="bg-[#5d4037] p-5 rounded-2xl border-4 border-[#795548] shadow-lg relative group transition-transform hover:scale-[1.01]">
                                {/* Question Number Badge */}
                                <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#ffca28] rounded-full border-4 border-[#f57f17] flex items-center justify-center font-black text-[#3e2723] text-lg shadow-md z-10">
                                    {idx + 1}
                                </div>

                                <label className="block text-yellow-400 font-bold mb-3 text-lg pl-4 text-[shadow:1px_1px_0_#000] leading-snug">
                                    {q.label}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={answers[q.id] || ''}
                                    placeholder="Ketik jawabanmu di sini..."
                                    className="w-full px-5 py-4 rounded-xl border-4 border-[#8d6e63] bg-[#3e2723] text-white placeholder-gray-400 focus:border-yellow-400 focus:bg-[#4e342e] outline-none font-bold text-lg transition-all shadow-inner"
                                    onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                />
                            </div>
                        ))}

                        <div className="flex justify-between items-center gap-4 pt-4 border-t-4 border-[#5d4037/50]">
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard/siswa')}
                                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-bold border-b-4 border-gray-700 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Kembali
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-8 py-3 bg-[#00c853] hover:bg-[#00e676] text-white rounded-full font-bold border-b-4 border-[#1b5e20] active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_0_rgba(0,0,0,0.2)]"
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mengirim...
                                    </>
                                ) : (
                                    <>
                                        Kirim Jawaban
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
    )
}
