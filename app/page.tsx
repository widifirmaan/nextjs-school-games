import Link from 'next/link'

export default function Home() {
    return (
        <main className="body-login min-h-screen">
            <div className="login-panel game-panel text-center">
                <div className="header-ribbon">BukuMedia</div>
                <p className="mb-8 text-lg font-bold">Platform Pembelajaran Interaktif</p>

                <div className="space-y-4">
                    <Link href="/login" className="btn-game-login block w-full no-underline hover:text-white relative z-20">
                        Masuk
                    </Link>
                </div>
            </div>
        </main>
    )
}
