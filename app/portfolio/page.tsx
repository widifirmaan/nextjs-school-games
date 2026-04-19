import Link from 'next/link'

export default function PortfolioPage() {
    return (
        <main className="portfolio-body min-h-screen bg-[#b3e5fc] p-10 print:p-0">
            <style dangerouslySetInnerHTML={{ __html: `
                :root {
                    --bg-body: #b3e5fc;
                    --panel-bg: #3e2723;
                    --panel-border: #1a237e;
                    --card-bg: #3949ab;
                    --card-border: #7986cb;
                    --btn-yellow: #ffca28;
                    --text-shadow: 2px 2px 0px #000;
                }

                @page {
                    size: A4 landscape;
                    margin: 0;
                }

                .portfolio-body {
                    background-image: radial-gradient(#81d4fa 15%, transparent 16%), radial-gradient(#81d4fa 15%, transparent 16%);
                    background-size: 60px 60px;
                    background-position: 0 0, 30px 30px;
                    background-attachment: fixed;
                }

                .portfolio-page {
                    width: 297mm;
                    height: 210mm;
                    padding: 15mm;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                    background-color: var(--bg-body);
                    margin: 40px auto;
                    border: 8px solid var(--panel-border);
                    border-radius: 40px;
                    page-break-after: always;
                    box-shadow: 0 20px 0 rgba(0, 0, 0, 0.1);
                    color: #333;
                    font-family: var(--font-nunito), sans-serif;
                }

                @media print {
                    body, .portfolio-body {
                        background: white !important;
                        padding: 0 !important;
                    }
                    .portfolio-page {
                        margin: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        width: 297mm !important;
                        height: 210mm !important;
                        border-radius: 0 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }

                .game-panel-portfolio {
                    background-color: var(--panel-bg);
                    border: 8px solid var(--panel-border);
                    border-radius: 30px;
                    padding: 25px;
                    box-shadow: 0 10px 0 rgba(0, 0, 0, 0.2);
                    color: white;
                }

                .header-ribbon-portfolio {
                    background: linear-gradient(180deg, #fdd835 0%, #f9a825 100%);
                    width: fit-content;
                    margin: 0 auto 20px auto;
                    padding: 10px 40px;
                    border-radius: 15px;
                    border-bottom: 5px solid #e65100;
                    color: white;
                    font-family: var(--font-fredoka), cursive;
                    font-size: 1.8rem;
                    text-transform: uppercase;
                    text-shadow: var(--text-shadow);
                    position: relative;
                }

                .screenshot-frame {
                    border: 6px solid var(--panel-border);
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                }

                .screenshot-frame img {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                .page-num {
                    position: absolute;
                    bottom: 8mm;
                    right: 8mm;
                    background: var(--panel-bg);
                    color: var(--btn-yellow);
                    padding: 5px 20px;
                    border-radius: 50px;
                    border: 3px solid var(--panel-border);
                    font-weight: 900;
                    font-family: var(--font-fredoka);
                }

                h1 {
                    font-family: var(--font-fredoka);
                    font-size: 4.5rem;
                    color: var(--panel-bg);
                    text-shadow: 4px 4px 0 #fff;
                    line-height: 1;
                    margin-bottom: 20px;
                }

                h2 {
                    font-family: var(--font-fredoka);
                    font-size: 2rem;
                    color: var(--btn-yellow);
                    text-shadow: var(--text-shadow);
                    margin-bottom: 15px;
                }

                .layout-hero {
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                }

                .layout-split {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr;
                    gap: 30px;
                    align-items: center;
                    height: 100%;
                }

                .badge-game {
                    background: var(--panel-border);
                    color: white;
                    padding: 5px 15px;
                    border-radius: 10px;
                    font-weight: bold;
                    display: inline-block;
                    margin-bottom: 10px;
                }
            ` }} />

            {/* PAGE 01: COVER */}
            <section className="portfolio-page layout-hero" style={{ backgroundColor: 'var(--bg-body)' }}>
                <div className="header-ribbon-portfolio" style={{ marginBottom: '40px' }}>
                    2026 PRODUCT SHOWCASE
                </div>
                <h1>NEXTJS <span style={{ color: 'var(--panel-border)' }}>-</span> SCHOOL GAMES</h1>
                <div className="game-panel-portfolio" style={{ marginTop: '20px' }}>
                    <p className="text-2xl font-black font-fredoka uppercase tracking-wider">PELAYARAN JIWA: Platform Pembelajaran Interaktif</p>
                </div>
                <div className="page-num">01</div>
            </section>

            {/* PAGE 02: STUDENT DASHBOARD */}
            <section className="portfolio-page">
                <div className="layout-split">
                    <div className="flex flex-col gap-4">
                        <div className="header-ribbon-portfolio !m-0 !text-sm">Student Experience</div>
                        <h1 className="!text-5xl !text-left">Student Dashboard</h1>
                        <div className="game-panel-portfolio">
                            <p className="text-lg font-bold leading-relaxed">
                                Antarmuka ceria yang memudahkan siswa memantau progres, melihat skor, dan memilih level permainan dengan navigasi yang intuitif.
                            </p>
                        </div>
                    </div>
                    <div className="screenshot-frame">
                        <img src="/screenshots/Student Dashboard Page.png" alt="Student Dashboard" />
                    </div>
                </div>
                <div className="page-num">02</div>
            </section>

            {/* PAGE 03: TEACHER DASHBOARD */}
            <section className="portfolio-page">
                <div className="layout-split" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
                    <div className="screenshot-frame">
                        <img src="/screenshots/Dashboard Guru Page.png" alt="Teacher Dashboard" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="header-ribbon-portfolio !m-0 !text-sm">Administrative Tools</div>
                        <h1 className="!text-5xl !text-left">Teacher Panel</h1>
                        <div className="game-panel-portfolio">
                            <p className="text-lg font-bold leading-relaxed">
                                Kendali penuh bagi pengajar untuk memantau aktivitas siswa, menganalisis jawaban detail, dan mengekspor laporan ke Excel.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="page-num">03</div>
            </section>

            {/* PAGE 04: LEVEL SELECTION */}
            <section className="portfolio-page">
                <div className="layout-split">
                    <div className="flex flex-col gap-4">
                        <div className="header-ribbon-portfolio !m-0 !text-sm">Interactive Content</div>
                        <h1 className="!text-5xl !text-left">30 Unique Levels</h1>
                        <div className="game-panel-portfolio">
                            <p className="text-lg font-bold leading-relaxed">
                                Koleksi 30 level tantangan yang mencakup Word Search, Drawing, dan Refleksi untuk mendukung pengembangan diri siswa.
                            </p>
                        </div>
                    </div>
                    <div className="screenshot-frame">
                        <img src="/screenshots/Student Dashboard Level Page.png" alt="Level Selection" />
                    </div>
                </div>
                <div className="page-num">04</div>
            </section>

            {/* PAGE 05: MOBILE EXPERIENCE */}
            <section className="portfolio-page">
                <div className="flex flex-col h-full items-center justify-between py-10">
                    <div className="header-ribbon-portfolio">Responsive Experience</div>
                    <h1 className="!text-5xl">Learn Anywhere, Anytime</h1>
                    <div className="flex gap-8 items-center justify-center flex-1 w-full">
                        <div className="w-1/3 screenshot-frame transform -rotate-3">
                            <img src="/screenshots/Mobile Login Page.png" alt="Mobile Login" />
                        </div>
                        <div className="w-1/3 screenshot-frame transform rotate-3">
                            <img src="/screenshots/Mobile Student Dashboard Page.png" alt="Mobile Dashboard" />
                        </div>
                        <div className="w-1/4 game-panel-portfolio">
                            <p className="font-bold text-center italic">"Optimized for every screen size with seamless performance."</p>
                        </div>
                    </div>
                </div>
                <div className="page-num">05</div>
            </section>

            {/* PAGE 06: AUTHENTICATION */}
            <section className="portfolio-page">
                <div className="layout-split">
                    <div className="screenshot-frame">
                        <img src="/screenshots/login.png" alt="Login" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="header-ribbon-portfolio !m-0 !text-sm">Security</div>
                        <h1 className="!text-5xl !text-left">Secure Gateway</h1>
                        <div className="game-panel-portfolio">
                            <p className="text-lg font-bold leading-relaxed">
                                Sistem autentikasi yang aman menggunakan NextAuth, memisahkan peran akses antara Siswa dan Guru dengan perlindungan data maksimal.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="page-num">06</div>
            </section>

            {/* PAGE 07: LEVEL PREVIEW 1 */}
            <section className="portfolio-page">
                <div className="header-ribbon-portfolio !mb-10">Level Showcase: Discovery</div>
                <div className="grid grid-cols-3 gap-6 flex-1">
                    {[1, 2, 3, 4, 5, 6].map(lvl => (
                        <div key={lvl} className="screenshot-frame">
                            <img src={`/screenshots/level-${lvl}.png`} alt={`Level ${lvl}`} />
                        </div>
                    ))}
                </div>
                <div className="page-num">07</div>
            </section>

            {/* PAGE 08: LEVEL PREVIEW 2 */}
            <section className="portfolio-page">
                <div className="header-ribbon-portfolio !mb-10">Level Showcase: Reflection</div>
                <div className="grid grid-cols-3 gap-6 flex-1">
                    {[10, 12, 13, 20, 21, 24].map(lvl => (
                        <div key={lvl} className="screenshot-frame">
                            <img src={`/screenshots/level-${lvl}.png`} alt={`Level ${lvl}`} />
                        </div>
                    ))}
                </div>
                <div className="page-num">08</div>
            </section>

            {/* PAGE 09: TECH STACK */}
            <section className="portfolio-page layout-hero">
                <div className="header-ribbon-portfolio">Modern Technology</div>
                <h1 className="!text-5xl mb-12">The Power Behind Pelayaran Jiwa</h1>
                <div className="grid grid-cols-3 gap-8 w-full max-w-5xl">
                    <div className="game-panel-portfolio">
                        <h2 className="text-center">FRONTEND</h2>
                        <ul className="text-sm font-bold list-disc list-inside">
                            <li>Next.js 14</li>
                            <li>TypeScript</li>
                            <li>Tailwind CSS</li>
                            <li>Fredoka Fonts</li>
                        </ul>
                    </div>
                    <div className="game-panel-portfolio">
                        <h2 className="text-center">BACKEND</h2>
                        <ul className="text-sm font-bold list-disc list-inside">
                            <li>MongoDB</li>
                            <li>Mongoose</li>
                            <li>NextAuth.js</li>
                            <li>Node.js</li>
                        </ul>
                    </div>
                    <div className="game-panel-portfolio">
                        <h2 className="text-center">TOOLS</h2>
                        <ul className="text-sm font-bold list-disc list-inside">
                            <li>Excel Export</li>
                            <li>Mongoose DB</li>
                            <li>Lucide Icons</li>
                            <li>Real-time Persistence</li>
                        </ul>
                    </div>
                </div>
                <div className="page-num">09</div>
            </section>

            {/* PAGE 10: CLOSING */}
            <section className="portfolio-page layout-hero" style={{ backgroundColor: 'var(--panel-bg)' }}>
                <h1 style={{ fontSize: '10rem', color: 'white', textShadow: '6px 6px 0 var(--panel-border)' }}>THANKS!</h1>
                <div className="header-ribbon-portfolio !text-2xl">
                    WIDI FIRMAAN | LEAD DEVELOPER
                </div>
                <p className="text-white font-bold mt-8 opacity-60 italic">NextJS - School Games 2026</p>
                <div className="page-num">10</div>
            </section>
        </main>
    )
}
