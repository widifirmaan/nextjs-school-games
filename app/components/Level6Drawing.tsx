'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LEVEL_DATA } from '@/lib/gameData'
import GameAlert from './GameAlert'

interface Level6DrawingProps {
    levelId: string;
    onComplete: (data: any) => void;
    initialData?: Record<string, string>;
}

// Reusable SVG Drawing Component
const DrawingCanvas = ({ id, onSave, className, initialValue }: { id: string, onSave: (id: string, data: string) => void, className: string, initialValue?: string }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [paths, setPaths] = useState<string[]>([])
    const [isDrawing, setIsDrawing] = useState(false)
    const [currentPath, setCurrentPath] = useState<string>('')

    // Restore saved paths
    useEffect(() => {
        if (initialValue) {
            try {
                const parsed = JSON.parse(initialValue)
                if (Array.isArray(parsed)) {
                    setPaths(parsed)
                }
            } catch (e) {
                // If parsing fails (e.g. empty string or invalid json), ignore
            }
        }
    }, [initialValue])

    // Internal resolution for Scalable Vector Graphics
    // We map all input to a 500x500 coordinate space
    const VIEWBOX_SIZE = 500

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const container = containerRef.current
        if (!container) return { x: 0, y: 0 }

        const rect = container.getBoundingClientRect()
        let clientX, clientY

        if ('touches' in e) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            clientX = (e as React.MouseEvent).clientX
            clientY = (e as React.MouseEvent).clientY
        }

        // Map to viewBox 0-500
        const x = ((clientX - rect.left) / rect.width) * VIEWBOX_SIZE
        const y = ((clientY - rect.top) / rect.height) * VIEWBOX_SIZE
        return { x, y }
    }

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        // Prevent scrolling for touch
        // e.preventDefault() // React strict mode issues, handled by touch-action css

        setIsDrawing(true)
        const { x, y } = getCoordinates(e)
        setCurrentPath(`M ${x.toFixed(1)} ${y.toFixed(1)}`)
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return

        const { x, y } = getCoordinates(e)
        // Append L x y
        setCurrentPath(prev => `${prev} L ${x.toFixed(1)} ${y.toFixed(1)}`)
    }

    const stopDrawing = () => {
        if (!isDrawing) return
        setIsDrawing(false)
        if (currentPath) {
            const newPaths = [...paths, currentPath]
            setPaths(newPaths)
            // Save as JSON string of paths array - efficient and scalable
            onSave(id, JSON.stringify(newPaths))
            setCurrentPath('')
        }
    }

    const clearCanvas = () => {
        setPaths([])
        onSave(id, '') // Clear saved data
    }

    return (
        <div ref={containerRef} className={`absolute ${className} touch-none`}>
            <svg
                viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
                preserveAspectRatio="none"
                className="w-full h-full cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            >
                {/* Render saved paths */}
                {paths.map((d, i) => (
                    <path key={i} d={d} stroke="black" strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                ))}
                {/* Render current drawing path */}
                {isDrawing && (
                    <path d={currentPath} stroke="black" strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                )}
            </svg>

            {paths.length > 0 && (
                <button
                    onClick={clearCanvas}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200 hover:bg-red-200"
                    type="button"
                >
                    Hapus
                </button>
            )}
        </div>
    )
}

export default function Level6Drawing({ levelId, onComplete, initialData }: Level6DrawingProps) {
    const router = useRouter()
    const levelConfig = LEVEL_DATA[levelId] || { questions: [] }

    const [drawings, setDrawings] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [warning, setWarning] = useState('')

    useEffect(() => {
        if (initialData) {
            setDrawings(prev => ({ ...prev, ...initialData }))
        }
    }, [initialData])

    const handleSaveDrawing = (id: string, data: string) => {
        setDrawings(prev => ({
            ...prev,
            [id]: data
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const requiredFaces = ['face_senang', 'face_sedih', 'face_marah', 'face_terkejut']
        // Check if data exists and is not empty array string "[]"
        const hasAll = requiredFaces.every(id => drawings[id] && drawings[id] !== "[]" && drawings[id].length > 5)

        if (!hasAll) {
            setWarning("Silakan gambar semua ekspresi wajah!")
            return
        }

        setSubmitting(true)
        onComplete(drawings)
    }

    // Coordinates mapping
    const getPositionClass = (id: string) => {
        switch (id) {
            case 'face_senang': return "top-[28%] left-[20%] w-[22%] h-[13%]"
            case 'face_sedih': return "top-[28%] left-[61%] w-[22%] h-[13%]"
            case 'face_marah': return "top-[68%] left-[20%] w-[22%] h-[13%]"
            case 'face_terkejut': return "top-[68%] left-[61%] w-[22%] h-[13%]"
            default: return "hidden"
        }
    }

    return (
        <>
            <GameAlert isOpen={!!warning} message={warning} onClose={() => setWarning('')} />
            <div className="min-h-screen bg-[#fff3e0] py-2 px-4 font-fredoka flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(#ffe0b2 10%, transparent 10%)', backgroundSize: '20px 20px' }}>
                <div className="relative h-[90vh] aspect-[1131/1600] animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)] mx-auto">

                    {/* Decoration */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 w-3/4">
                        <div className="bg-[#ff7043] text-white py-2 text-center rounded-full border-b-[6px] border-[#d84315] shadow-lg">
                            <span className="font-black uppercase tracking-widest text-lg md:text-xl whitespace-nowrap px-4">
                                {levelConfig.title || "LEVEL 6"}
                            </span>
                        </div>
                    </div>

                    <div className="w-full h-full bg-white rounded-[30px] shadow-2xl overflow-hidden border-[8px] border-[#ff7043] relative">
                        <Image
                            src="/images/level6-bg.jpeg"
                            alt="Level 6 Background"
                            fill
                            className="object-cover pointer-events-none"
                            priority
                        />

                        {/* Drawing Layer */}
                        <div className="absolute inset-0 z-10">
                            {levelConfig.questions.map(q => (
                                <DrawingCanvas
                                    key={q.id}
                                    id={q.id}
                                    onSave={handleSaveDrawing}
                                    className={getPositionClass(q.id)}
                                    initialValue={drawings[q.id]}
                                />
                            ))}

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
                                    onClick={handleSubmit}
                                    disabled={submitting || (initialData && Object.keys(initialData).length > 0)}
                                    className="bg-[#00c853] hover:bg-[#00e676] text-white rounded-full px-6 py-3 font-bold shadow-lg flex items-center gap-2 border-b-4 border-[#1b5e20] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                >
                                    {(initialData && Object.keys(initialData).length > 0) ? "Sudah Disimpan" : (submitting ? "Menyimpan..." : "Simpan Gambar")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
