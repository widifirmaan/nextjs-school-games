'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LEVEL_DATA } from '@/lib/gameData'
import GameAlert from './GameAlert'

interface Level13DrawingProps {
    levelId: string;
    onComplete: (data: any) => void;
    initialData?: Record<string, string>;
}

// Reusable SVG Drawing Component (Adapted for Full Screen)
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
        // Prevent default browser scrolling/zooming when drawing
        // Note: touch-none css class handles most of this
        setIsDrawing(true)
        const { x, y } = getCoordinates(e)
        setCurrentPath(`M ${x.toFixed(1)} ${y.toFixed(1)}`)
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return
        const { x, y } = getCoordinates(e)
        setCurrentPath(prev => `${prev} L ${x.toFixed(1)} ${y.toFixed(1)}`)
    }

    const stopDrawing = () => {
        if (!isDrawing) return
        setIsDrawing(false)
        if (currentPath) {
            const newPaths = [...paths, currentPath]
            setPaths(newPaths)
            onSave(id, JSON.stringify(newPaths))
            setCurrentPath('')
        }
    }

    const clearCanvas = () => {
        if (confirm("Apakah anda yakin ingin menghapus semua coretan?")) {
            setPaths([])
            onSave(id, '') // Clear saved data
        }
    }

    return (
        <div ref={containerRef} className={`absolute ${className} touch-none overflow-hidden`}>
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
                    <path key={i} d={d} stroke="#212121" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
                ))}
                {/* Render current drawing path */}
                {isDrawing && <path d={currentPath} stroke="#212121" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />}
            </svg>

            {paths.length > 0 && (
                <button
                    onClick={clearCanvas}
                    className="absolute top-4 right-4 bg-red-100/90 text-red-600 px-3 py-2 rounded-xl border border-red-200 hover:bg-red-200 shadow-sm text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
                    type="button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Hapus
                </button>
            )}
        </div>
    )
}

export default function Level13Drawing({ levelId, onComplete, initialData }: Level13DrawingProps) {
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

        // Check if canvas is empty
        // The id is 'canvas_full'
        const data = drawings['canvas_full']
        // If undefined, or empty string, or empty array JSON "[]"
        const hasContent = data && data !== "[]" && data.length > 5;

        if (!hasContent) {
            setWarning("Silakan buat coretan atau gambar sesuatu!")
            return
        }

        setSubmitting(true)
        onComplete(drawings)
    }

    const isSubmitted = initialData && Object.keys(initialData).length > 0;

    return (
        <>
            <GameAlert isOpen={!!warning} message={warning} onClose={() => setWarning('')} />
            <div className="min-h-screen bg-[#fafafa] py-2 px-4 font-fredoka flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(#e0e0e0 10%, transparent 10%)', backgroundSize: '20px 20px' }}>
                <div className="relative h-[90vh] aspect-[1131/1600] animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)] mx-auto">

                    {/* Decoration */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 w-3/4 pointer-events-none">
                        <div className="bg-[#424242] text-white py-2 text-center rounded-full border-b-[6px] border-[#212121] shadow-lg">
                            <span className="font-black uppercase tracking-widest text-lg md:text-xl whitespace-nowrap px-4">
                                {levelConfig.title || "LEVEL 13"}
                            </span>
                        </div>
                    </div>

                    <div className="w-full h-full bg-white rounded-[30px] shadow-2xl overflow-hidden border-[8px] border-[#424242] relative">
                        <Image
                            src="/images/level13-bg.png"
                            alt="Level 13 Background"
                            fill
                            className="object-cover pointer-events-none"
                            priority
                        />

                        {/* Drawing Layer - Full Screen OVerlay */}
                        {/* We use z-10 for canvas, z-20 for controls if needed, but canvas needs pointer events */}
                        <DrawingCanvas
                            id="canvas_full"
                            onSave={handleSaveDrawing}
                            className="inset-0 z-10"
                            initialValue={drawings['canvas_full']}
                        />

                        {/* Controls - Positioned at bottom like other levels, but must be above canvas z-index if overlaying */}
                        {/* If canvas is inset-0, bottom controls overlap. With z-20 they will be clickable. */}
                        <div className="absolute bottom-6 left-4 right-4 flex justify-between items-center z-20 pointer-events-auto">
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard/siswa')}
                                className="bg-white/90 hover:bg-white text-[#424242] rounded-full px-4 py-3 font-bold shadow-lg flex items-center gap-2 border-2 border-[#424242] transition-transform active:scale-95 text-sm md:text-base"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Kembali
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={submitting || isSubmitted}
                                className="bg-[#00c853] hover:bg-[#00e676] text-white rounded-full px-6 py-3 font-bold shadow-lg flex items-center gap-2 border-b-4 border-[#1b5e20] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                            >
                                {isSubmitted ? "Sudah Disimpan" : (submitting ? "Menyimpan..." : "Simpan Karya")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
