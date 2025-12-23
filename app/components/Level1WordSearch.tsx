'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface WordSearchGameProps {
    levelId: string;
    onComplete: (data: any) => void;
    initialData?: Record<string, string>;
}

const GRID_SIZE = 12;
const GRID_LETTERS = [
    ['n', 'v', 'k', 'p', 'e', 'd', 'u', 'l', 'i', 'm', 'i', 'p'],
    ['s', 'c', 'e', 'f', 'x', 'k', 'u', 'a', 't', 'n', 'e', 'x'],
    ['r', 'i', 'm', 'a', 'n', 'd', 'i', 'r', 'i', 'm', 'h', 'i'],
    ['c', 'e', 'r', 'i', 'a', 'k', 'r', 'e', 'a', 't', 'i', 'f'],
    ['a', 'i', 'a', 's', 'i', 'k', 'z', 'a', 't', 'p', 'a', 'z'],
    ['n', 'z', 'm', 'o', 'h', 's', 'f', 'g', 'i', 'g', 'i', 'h'],
    ['t', 's', 'a', 'b', 'a', 'r', 's', 'k', 's', 't', 'e', 'r'],
    ['i', 'x', 'h', 's', 'o', 'p', 't', 'i', 'm', 'i', 's', 'n'],
    ['k', 'n', 't', 'e', 'r', 'b', 'u', 'k', 'a', 'g', 'x', 'k'],
    ['j', 'u', 'j', 'u', 'r', 'm', 'b', 'e', 'r', 'a', 'n', 'i'],
];

const TARGET_WORDS = [
    "PEDULI", "KUAT", "MANDIRI", "CERIA", "KREATIF",
    "ASIK", "GIGIH", "SABAR", "OPTIMIS", "TERBUKA", "JUJUR", "BERANI"
];

// Helper to find word coordinates (simple horizontal/vertical scan)
const findWordCoordinates = (word: string): Set<string> => {
    const coords = new Set<string>();
    if (!word) return coords;

    word = word.toLowerCase();
    const rows = GRID_LETTERS.length;
    const cols = GRID_LETTERS[0].length;

    // Check Horizontal
    for (let r = 0; r < rows; r++) {
        const rowStr = GRID_LETTERS[r].join('');
        if (rowStr.includes(word)) {
            const startCol = rowStr.indexOf(word);
            for (let i = 0; i < word.length; i++) {
                coords.add(`${r}-${startCol + i}`);
            }
            return coords;
        }
    }

    // Check Vertical
    for (let c = 0; c < cols; c++) {
        let colStr = '';
        for (let r = 0; r < rows; r++) {
            colStr += GRID_LETTERS[r][c];
        }
        if (colStr.includes(word)) {
            const startRow = colStr.indexOf(word);
            for (let i = 0; i < word.length; i++) {
                coords.add(`${startRow + i}-${c}`);
            }
            return coords;
        }
    }

    return coords;
}

export default function Level1WordSearch({ levelId, onComplete, initialData }: WordSearchGameProps) {
    const router = useRouter()
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    // Setup initial state if data exists
    useEffect(() => {
        if (initialData && initialData['kata_pilihan']) {
            const savedWord = initialData['kata_pilihan'];
            // Ensure we don't overwrite if user has already started selecting (optional, but good UX)
            // However, for "re-opening", we want to show the saved state.
            // Since this effect runs on prop change (fetch complete), it's correct to set it.
            const coords = findWordCoordinates(savedWord);
            if (coords.size > 0) {
                setSelectedCells(coords);
            }
        }
    }, [initialData]);

    const toggleCell = (row: number, col: number) => {
        const key = `${row}-${col}`
        const newSelected = new Set(selectedCells)
        if (newSelected.has(key)) {
            newSelected.delete(key)
        } else {
            newSelected.add(key)
        }
        setSelectedCells(newSelected)
    }

    const checkWords = () => {
        let selectedLetters: { r: number, c: number, val: string }[] = []
        selectedCells.forEach(key => {
            const [r, c] = key.split('-').map(Number)
            selectedLetters.push({ r, c, val: GRID_LETTERS[r][c].toUpperCase() })
        })

        selectedLetters.sort((a, b) => (a.r * 100 + a.c) - (b.r * 100 + b.c))
        return selectedLetters.map(l => l.val).join('')
    }

    const validateSelection = () => {
        if (selectedCells.size < 3) return { valid: false, msg: "Minimal 3 huruf!" };

        const cells = Array.from(selectedCells).map(k => {
            const [r, c] = k.split('-').map(Number);
            return { r, c };
        });

        // Check Horizontal
        const rows = new Set(cells.map(c => c.r));
        if (rows.size === 1) {
            const cols = cells.map(c => c.c).sort((a, b) => a - b);
            for (let i = 0; i < cols.length - 1; i++) {
                if (cols[i + 1] !== cols[i] + 1) return { valid: false, msg: "Huruf harus berurutan tanpa jeda!" };
            }
            return { valid: true };
        }

        // Check Vertical
        const cols = new Set(cells.map(c => c.c));
        if (cols.size === 1) {
            const rowsArr = cells.map(c => c.r).sort((a, b) => a - b);
            for (let i = 0; i < rowsArr.length - 1; i++) {
                if (rowsArr[i + 1] !== rowsArr[i] + 1) return { valid: false, msg: "Huruf harus berurutan tanpa jeda!" };
            }
            return { valid: true };
        }

        return { valid: false, msg: "Pilih huruf dalam satu garis lurus (mendatar atau menurun)!" };
    }

    const handlePreSubmit = () => {
        const validation = validateSelection();
        if (!validation.valid) {
            setAlertMessage(validation.msg || "Pilihan tidak valid");
            return;
        }

        setShowConfirmModal(true)
    }

    const handleConfirmSubmit = () => {
        setShowConfirmModal(false)
        setSubmitting(true)

        const word = checkWords();
        // Submit the word as the answer
        onComplete({
            "kata_pilihan": word
        })
    }

    return (
        <div className="min-h-screen bg-[#b3e5fc] py-10 px-4 font-fredoka" style={{ backgroundImage: 'radial-gradient(#90caf9 10%, transparent 10%)', backgroundSize: '20px 20px' }}>
            <div className="max-w-4xl mx-auto relative animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]">

                {/* Decoration Ribbon */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10 w-3/4">
                    <div className="bg-[#ffca28] text-[#3e2723] py-2 text-center rounded-full border-b-[6px] border-[#f57f17] shadow-lg">
                        <span className="font-black uppercase tracking-widest text-lg md:text-xl">
                            FIND THE WORDS!
                        </span>
                    </div>
                </div>

                <div className="bg-[#3e2723] rounded-[30px] shadow-2xl overflow-hidden border-[8px] border-[#304ffe] mt-6">
                    <div className="bg-[#304ffe] p-8 pt-10 text-center border-b-[6px] border-[#1a237e] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_10%,_transparent_10%)] bg-[length:20px_20px]"></div>
                        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider text-[shadow:2px_2px_0_#000] relative z-10 mb-2">
                            Carilah Kata Yang Menggambarkan Dirimu!
                        </h1>
                        <p className="text-blue-100 text-sm font-bold">
                            (Tandai huruf-huruf pada grid di bawah)
                        </p>
                    </div>

                    <div className="p-6 md:p-10 bg-[#4e342e] flex flex-col items-center">

                        <div className="flex flex-col xl:flex-row items-center justify-center gap-8 md:gap-12 w-full">

                            {/* Illustration Side */}
                            <div className="flex-1 flex flex-col items-center justify-center order-1 xl:order-1">
                                <div className="bg-white p-4 rounded-3xl border-4 border-[#304ffe] shadow-[0_8px_0_rgba(0,0,0,0.2)] transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                                    <img
                                        src="/mirror_reflection.png"
                                        alt="Cermin Diri"
                                        className="w-full max-w-[250px] md:max-w-[300px] h-auto rounded-xl"
                                    />
                                </div>
                                <div className="mt-6 bg-[#ffca28] text-[#3e2723] px-6 py-3 rounded-xl border-4 border-[#f57f17] shadow-lg text-center max-w-[300px]">
                                    <p className="font-bold leading-tight">
                                        "Apa yang kamu lihat saat bercermin?"
                                    </p>
                                </div>
                            </div>

                            {/* Grid Side */}
                            <div className="flex-none order-2 xl:order-2">
                                {/* Word Grid */}
                                <div className="inline-grid grid-cols-12 gap-1 md:gap-2 p-3 md:p-4 bg-[#5d4037] rounded-xl border-4 border-[#795548] shadow-lg mb-8">
                                    {GRID_LETTERS.map((row, rIdx) => (
                                        row.map((letter, cIdx) => {
                                            const isSelected = selectedCells.has(`${rIdx}-${cIdx}`)
                                            return (
                                                <button
                                                    key={`${rIdx}-${cIdx}`}
                                                    onClick={() => toggleCell(rIdx, cIdx)}
                                                    className={`
                                                        w-6 h-6 md:w-10 md:h-10 text-sm md:text-xl font-black uppercase rounded-md transition-all duration-100 flex items-center justify-center
                                                        ${isSelected
                                                            ? 'bg-[#ffca28] text-[#3e2723] transform scale-110 shadow-lg border-2 border-white'
                                                            : 'bg-[#efebe9] text-[#3e2723] hover:bg-white border-b-4 border-[#d7ccc8]'
                                                        }
                                                    `}
                                                >
                                                    {letter}
                                                </button>
                                            )
                                        })
                                    ))}
                                </div>

                                {/* Selected Word Display */}
                                <div className="w-full">
                                    <div className="bg-[#3e2723] border-4 border-[#5d4037] rounded-xl p-4 text-center">
                                        <p className="text-gray-400 text-xs font-bold uppercase mb-1">Kata Pilihanmu:</p>
                                        <div className="h-10 flex items-center justify-center">
                                            <span className="text-2xl font-black text-[#ffca28] tracking-widest uppercase">
                                                {checkWords() || "..."}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center gap-4 w-full max-w-4xl border-t-4 border-[#5d4037/50] pt-6 mt-8">
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard/siswa')}
                                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-bold border-b-4 border-gray-700 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide flex items-center gap-2"
                            >
                                Kembali
                            </button>
                            <button
                                onClick={handlePreSubmit}
                                disabled={submitting || selectedCells.size === 0}
                                className="px-8 py-3 bg-[#00c853] hover:bg-[#00e676] text-white rounded-full font-bold border-b-4 border-[#1b5e20] active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_0_rgba(0,0,0,0.2)]"
                            >
                                {submitting ? 'Menyimpan...' : 'Pilih Kata Ini'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm grid place-items-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="w-full max-w-sm relative animate-[popIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border-8 border-[#304ffe]">
                            <div className="bg-[#304ffe] p-4 text-center border-b-4 border-[#1a237e]">
                                <h3 className="text-2xl font-black text-white font-fredoka uppercase tracking-wider text-[shadow:2px_2px_0_#000]">
                                    YAKIN?
                                </h3>
                            </div>

                            <div className="p-8 text-center bg-blue-50">
                                <p className="text-gray-600 font-bold mb-2">Anda memilih kata:</p>
                                <div className="text-3xl font-black text-[#304ffe] uppercase tracking-widest mb-4">
                                    "{checkWords()}"
                                </div>
                                <p className="text-gray-800 font-bold">Apakah kata ini menggambarkan dirimu?</p>
                            </div>

                            <div className="bg-gray-100 p-5 flex justify-center gap-4">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-bold shadow-md transition-transform active:scale-95 border-b-4 border-gray-700"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleConfirmSubmit}
                                    className="px-6 py-2 bg-[#00c853] hover:bg-[#00e676] text-white rounded-full font-bold shadow-md transition-transform active:scale-95 border-b-4 border-[#1b5e20]"
                                >
                                    Ya, Pilih
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert Modal */}
            {alertMessage && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm grid place-items-center z-[60] p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="w-full max-w-sm relative animate-[popIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border-8 border-red-500">
                            <div className="bg-red-500 p-4 text-center border-b-4 border-red-700">
                                <h3 className="text-2xl font-black text-white font-fredoka uppercase tracking-wider text-[shadow:2px_2px_0_#000]">
                                    OOPS!
                                </h3>
                            </div>

                            <div className="p-8 text-center bg-red-50">
                                <p className="text-gray-800 font-bold text-lg">{alertMessage}</p>
                            </div>

                            <div className="bg-gray-100 p-5 flex justify-center">
                                <button
                                    onClick={() => setAlertMessage(null)}
                                    className="px-8 py-2 bg-[#304ffe] hover:bg-[#1a237e] text-white rounded-full font-bold shadow-md transition-transform active:scale-95 border-b-4 border-[#000051]"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
