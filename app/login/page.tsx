'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
        })

        if (result?.error) {
            setError('Username atau password salah')
        } else {
            // Basic role based redirect could be handled here or in the middleware
            // For now, simple redirect to dashboard, which will handle routing
            router.push('/dashboard')
        }
    }

    return (
        <div className="body-login min-h-screen">
            <div className="login-panel game-panel">
                <div className="header-ribbon">
                    Login
                </div>

                {error && (
                    <div className="error-message text-center mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="game-label">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="game-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-game-login"
                    >
                        Masuk
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/" className="btn-cancel">
                        Kembali
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
