'use client'

interface GameAlertProps {
    message: string
    isOpen: boolean
    onClose: () => void
    title?: string
}

export default function GameAlert({ message, isOpen, onClose, title = "OOPS!" }: GameAlertProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm grid place-items-center z-[60] p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-sm relative animate-[popIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border-8 border-red-500">
                    <div className="bg-red-500 p-4 text-center border-b-4 border-red-700">
                        <h3 className="text-2xl font-black text-white font-fredoka uppercase tracking-wider text-[shadow:2px_2px_0_#000]">
                            {title}
                        </h3>
                    </div>

                    <div className="p-8 text-center bg-red-50">
                        <p className="text-gray-800 font-bold text-lg leading-relaxed">{message}</p>
                    </div>

                    <div className="bg-gray-100 p-5 flex justify-center">
                        <button
                            onClick={onClose}
                            className="px-8 py-2 bg-[#304ffe] hover:bg-[#1a237e] text-white rounded-full font-bold shadow-md transition-transform active:scale-95 border-b-4 border-[#000051]"
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
