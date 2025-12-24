'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'

import { LEVEL_DATA } from '@/lib/gameData'

interface User {
    _id: string
    username: string
    fullName: string
    email: string
    kelas: string
    schoolName: string
    levels?: Record<string, string> // Map of levelKey -> jsonString
}

export default function GuruDashboard() {
    const router = useRouter()
    const [students, setStudents] = useState<User[]>([])
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        kelas: '',
        schoolName: ''
    })

    // Level Detail Modal State
    const [showLevelModal, setShowLevelModal] = useState(false)
    const [selectedLevelData, setSelectedLevelData] = useState<any>(null)
    const [selectedStudentName, setSelectedStudentName] = useState('')
    const [selectedLevelId, setSelectedLevelId] = useState('')

    // Filters
    const [filterSchool, setFilterSchool] = useState('Semua Sekolah')
    const [filterClass, setFilterClass] = useState('Semua Kelas')
    const [filterName, setFilterName] = useState('')

    // Delete Confirmation State
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null)



    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setStudents(data))
    }, [])

    const openModalForNew = () => {
        setEditingId(null)
        setFormData({ username: '', password: '', fullName: '', email: '', kelas: '', schoolName: '' })
        setShowModal(true)
    }

    const openModalForEdit = (student: User) => {
        setEditingId(student._id)
        setFormData({
            username: student.username,
            password: '', // Keep empty to indicate no change
            fullName: student.fullName,
            email: student.email || '',
            kelas: student.kelas || '',
            schoolName: student.schoolName || ''
        })
        setShowModal(true)
    }

    const openLevelDetail = (studentName: string, levelKey: string, levelJson: string) => {
        try {
            const data = JSON.parse(levelJson);
            const levelId = levelKey.replace('level', '');
            setSelectedLevelData(data);
            setSelectedStudentName(studentName);
            setSelectedLevelId(levelId);
            setShowLevelModal(true);
        } catch (e) {
            console.error("Error parsing level data", e);
            alert("Data jawaban rusak atau tidak valid");
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const url = editingId ? `/api/users/${editingId}` : '/api/users'
        const method = editingId ? 'PUT' : 'POST'

        const res = await fetch(url, {
            method: method,
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        })

        if (res.ok) {
            const updatedUser = await res.json()
            if (editingId) {
                setStudents(students.map(s => s._id === editingId ? updatedUser : s))
            } else {
                setStudents([...students, updatedUser])
            }
            setShowModal(false)
            setFormData({ username: '', password: '', fullName: '', email: '', kelas: '', schoolName: '' })
        } else {
            console.error("Failed to save student", res)
            alert("Gagal menyimpan data siswa")
        }
    }

    const handleDelete = (id: string) => {
        setStudentToDelete(id)
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        if (!studentToDelete) return

        const res = await fetch(`/api/users/${studentToDelete}`, { method: 'DELETE' })
        if (res.ok) {
            setStudents(students.filter(s => s._id !== studentToDelete))
            setShowDeleteModal(false)
            setStudentToDelete(null)
        } else {
            alert("Gagal menghapus siswa")
        }
    }



    // Filter Logic
    const uniqueSchools = useMemo(() => {
        const schools = new Set(students.map(s => s.schoolName).filter(Boolean));
        return ['Semua Sekolah', ...Array.from(schools)];
    }, [students]);

    const uniqueClasses = useMemo(() => {
        const classes = new Set(students.map(s => s.kelas).filter(Boolean));
        return ['Semua Kelas', ...Array.from(classes)];
    }, [students]);

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchSchool = filterSchool === 'Semua Sekolah' || student.schoolName === filterSchool;
            const matchClass = filterClass === 'Semua Kelas' || student.kelas === filterClass;
            const matchName = student.fullName.toLowerCase().includes(filterName.toLowerCase());
            return matchSchool && matchClass && matchName;
        });
    }, [students, filterSchool, filterClass, filterName]);

    // Export Logic
    const handleExport = () => {
        const dataToExport = filteredStudents.map(student => {
            const row: Record<string, string | number> = {
                'Nama Lengkap': student.fullName,
                'Username': student.username,
                'Kelas': student.kelas || '-',
                'Sekolah': student.schoolName || '-',
            }

            // Loop columns for Levels 1-30
            for (let i = 1; i <= 30; i++) {
                const levelKey = `level${i}`
                const levelJson = student.levels?.[levelKey]

                if (levelJson) {
                    try {
                        const answers = JSON.parse(levelJson)
                        const levelConfig = LEVEL_DATA[i.toString()]

                        // We check if levelConfig exists to map question texts, 
                        // but if answers are just map of ID->Answer, we can iterate Object.entries(answers) if config missing.

                        const relevantKeys = Object.keys(answers).filter(k => k !== 'status' && k !== 'stars');
                        if (relevantKeys.length > 0) {
                            row[`Level ${i}`] = relevantKeys.map(k => {
                                const qConfig = levelConfig?.questions?.find(q => q.id === k);
                                const label = qConfig ? qConfig.label : k.replace(/_/g, ' ');
                                const val = i === 6 ? '[Gambar]' : answers[k];
                                return `${label} = ${val}`;
                            }).join('\n');
                        } else {
                            row[`Level ${i}`] = '-';
                        }
                    } catch (e) {
                        row[`Level ${i}`] = 'Error Data'
                    }
                } else {
                    row[`Level ${i}`] = '-'
                }
            }
            return row
        })

        const worksheet = XLSX.utils.json_to_sheet(dataToExport)

        // Calculate row heights to fit content (newlines)
        const rowHeights = dataToExport.map(row => {
            const maxLines = Object.values(row).reduce((max: number, cell) => {
                const str = String(cell || '')
                const lines = str.split('\n').length
                return Math.max(max, lines)
            }, 1)
            // Approx 15 points per line, min 20
            return { hpt: Math.max(20, maxLines * 15) }
        })

        // Apply row heights (First element is for the Header)
        worksheet['!rows'] = [{ hpt: 30 }, ...rowHeights]

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa")

        // Auto-width columns slightly
        const wscols = Object.keys(dataToExport[0] || {}).map(() => ({ wch: 40 }));
        worksheet['!cols'] = wscols;

        XLSX.writeFile(workbook, "Data_Siswa_BukuMedia.xlsx")
    }

    // Generate Level Columns (1-30)
    const levelColumns = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

    return (
        <div className="container-main px-4 py-8 flex flex-col items-center min-h-screen">

            {/* Main Panel */}
            <div className="game-panel w-full mt-10 p-6 relative">
                {/* Header Ribbon */}
                <div className="header-ribbon absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8">
                    MANAJEMEN SISWA
                </div>

                {/* Filter Section */}
                <div className="bg-[#2c1b18] rounded-xl p-4 mb-6 mt-6 flex flex-wrap gap-4 items-end shadow-inner border border-[#5d4037]">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-white font-fredoka mb-1 block text-sm">Sekolah</label>
                        <select
                            value={filterSchool}
                            onChange={(e) => setFilterSchool(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg px-3 py-2 font-bold text-gray-700 outline-none border-2 border-white focus:border-yellow-400"
                        >
                            {uniqueSchools.map(school => (
                                <option key={school} value={school}>{school}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <label className="text-white font-fredoka mb-1 block text-sm">Kelas</label>
                        <select
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg px-3 py-2 font-bold text-gray-700 outline-none border-2 border-white focus:border-yellow-400"
                        >
                            {uniqueClasses.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-[2] min-w-[250px]">
                        <label className="text-white font-fredoka mb-1 block text-sm">Cari Nama Siswa</label>
                        <input
                            type="text"
                            placeholder="Masukkan nama..."
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg px-3 py-2 font-bold text-gray-700 outline-none border-2 border-white focus:border-yellow-400"
                        />
                    </div>
                    <div className="flex gap-2">
                        {/* Export Button */}
                        <div className="relative group">
                            <button
                                onClick={handleExport}
                                className="bg-green-500 hover:bg-green-600 text-white font-fredoka uppercase px-6 py-2 rounded-lg border-b-4 border-green-700 shadow-lg active:border-b-0 active:mt-1 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                                </svg>
                                Export
                            </button>
                        </div>

                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-xl overflow-hidden shadow-xl mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="text-white font-fredoka bg-[#3949ab]">
                                <tr>
                                    <th className="px-4 py-3 sticky left-0 bg-[#3949ab] z-10 min-w-[200px] border-r border-blue-400">
                                        Nama Siswa
                                    </th>
                                    {levelColumns.map(lvl => (
                                        <th key={lvl} className="px-2 py-3 text-center min-w-[50px] whitespace-nowrap border-r border-blue-700/30">
                                            <div className="flex flex-col items-center">
                                                <span className="text-yellow-400 text-xs uppercase">Lvl</span>
                                                <span>{lvl}</span>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 sticky right-0 bg-[#3949ab] z-10 text-center min-w-[100px] border-l border-blue-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, idx) => (
                                    <tr key={student._id} className={`${idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'} hover:bg-blue-100 transition-colors`}>
                                        <td className={`px-4 py-3 font-bold text-gray-800 sticky left-0 z-10 border-r border-[#9fa8da] ${idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'}`}>
                                            {student.fullName}
                                        </td>
                                        {levelColumns.map(lvl => {
                                            const levelKey = `level${lvl}`;
                                            const hasLevel = student.levels && student.levels[levelKey];
                                            return (
                                                <td key={lvl} className="px-2 py-3 text-center border-r border-gray-200">
                                                    {hasLevel ? (
                                                        <button
                                                            onClick={() => openLevelDetail(student.fullName, levelKey, student.levels![levelKey])}
                                                            className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white mx-auto hover:scale-110 transition-transform shadow-sm"
                                                            title="Lihat Detail"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                                                            </svg>
                                                        </button>
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 mx-auto bg-gray-100"></div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className={`px-4 py-3 sticky right-0 z-10 border-l border-[#9fa8da] text-center ${idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'}`}>
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openModalForEdit(student)}
                                                    className="w-8 h-8 rounded bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                                                    title="Edit Siswa"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student._id)}
                                                    className="w-8 h-8 rounded bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                                                    title="Hapus Siswa"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan={32} className="text-center py-8 text-gray-500 italic bg-blue-50">
                                            Tidak ada data siswa
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-center gap-4 mt-8 pb-4">
                    <button
                        onClick={openModalForNew}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-fredoka font-bold py-3 px-8 rounded-full border-b-4 border-orange-700 shadow-xl uppercase tracking-wide flex items-center gap-2 text-lg active:border-b-2 active:translate-y-1 transition-all"
                    >
                        <span className="text-2xl font-bold">+</span> Tambah Siswa
                    </button>
                </div>


            </div>

            {showLevelModal && selectedLevelData && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm grid place-items-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="w-full max-w-2xl relative animate-[popIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                        {/* Close Button - Hanging outside */}
                        <button
                            onClick={() => setShowLevelModal(false)}
                            className="absolute -top-4 -right-4 bg-yellow-400 hover:bg-yellow-300 text-red-600 border-4 border-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg z-50 transition-transform hover:scale-110 active:scale-95"
                            style={{ boxShadow: '0 4px 0 #f57f17' }}
                        >
                            X
                        </button>

                        {/* Main Card */}
                        <div className="bg-[#3e2723] rounded-3xl overflow-hidden shadow-2xl border-8 border-[#3949ab]">
                            {/* Header */}
                            <div className="bg-[#3949ab] p-5 text-center border-b-4 border-[#283593] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_10%,_transparent_10%)] bg-[length:20px_20px]"></div>
                                <h3 className="text-2xl font-black text-white font-fredoka uppercase tracking-wider mb-1 relative z-10 text-[shadow:2px_2px_0_#000]">
                                    {LEVEL_DATA[selectedLevelId]?.title || `Level ${selectedLevelId}`}
                                </h3>
                                <p className="text-yellow-300 font-bold relative z-10 text-sm bg-[#283593] inline-block px-3 py-1 rounded-full mt-2">
                                    Siswa: {selectedStudentName}
                                </p>
                            </div>

                            {/* Scrollable Content */}
                            <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar bg-[#4e342e]">
                                <div className="space-y-4">
                                    {Object.entries(selectedLevelData)
                                        .filter(([key]) => key !== 'status' && key !== 'stars')
                                        .map(([key, value], idx) => {
                                            const qConfig = LEVEL_DATA[selectedLevelId]?.questions.find(q => q.id === key);
                                            const label = qConfig ? qConfig.label : key.replace(/_/g, ' ');
                                            return (
                                                <div key={key} className="bg-[#5d4037] p-4 rounded-xl border-2 border-[#795548] shadow-lg">
                                                    <div className="flex gap-3 mb-2">
                                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ffca28] text-[#3e2723] flex items-center justify-center font-bold font-fredoka border-2 border-[#f57f17]">
                                                            {idx + 1}
                                                        </div>
                                                        <p className="font-bold text-white pt-1">{label}</p>
                                                    </div>
                                                    <div className="pl-11">
                                                        {selectedLevelId === '6' ? (
                                                            <div className="bg-white p-2 rounded-lg border-2 border-green-500 overflow-hidden relative">
                                                                <svg viewBox="0 0 500 500" className="w-40 h-40 mx-auto">
                                                                    {(() => {
                                                                        try {
                                                                            const paths = typeof value === 'string' ? JSON.parse(value) : value;
                                                                            if (Array.isArray(paths)) {
                                                                                return paths.map((d: string, i: number) => (
                                                                                    <path key={i} d={d} stroke="black" strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                                                ));
                                                                            }
                                                                            return null;
                                                                        } catch {
                                                                            return null;
                                                                        }
                                                                    })()}
                                                                </svg>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-[#3e2723]/50 p-3 rounded-lg text-green-200 font-medium border-l-4 border-green-500 shadow-inner">
                                                                {String(value)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                    {Object.entries(selectedLevelData).filter(([key]) => key !== 'status' && key !== 'stars').length === 0 && (
                                        <div className="text-center py-10 flex flex-col items-center justify-center text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="font-bold text-lg">Tidak ada jawaban tersimpan</p>
                                        </div>
                                    )}
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Student Modal */}
            {/* Add/Edit Student Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm grid place-items-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="w-full max-w-md relative animate-[popIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute -top-4 -right-4 bg-yellow-400 hover:bg-yellow-300 text-red-600 border-4 border-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg z-50 transition-transform hover:scale-110 active:scale-95"
                            style={{ boxShadow: '0 4px 0 #f57f17' }}
                        >
                            X
                        </button>

                        <div className="bg-[#3e2723] rounded-3xl overflow-hidden shadow-2xl border-8 border-[#3949ab]">
                            <div className="bg-[#3949ab] p-5 text-center border-b-4 border-[#283593] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_10%,_transparent_10%)] bg-[length:20px_20px]"></div>
                                <h3 className="text-2xl font-black text-white font-fredoka uppercase tracking-wider relative z-10 text-[shadow:2px_2px_0_#000]">
                                    {editingId ? 'Edit Siswa' : 'Tambah Siswa'}
                                </h3>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 text-left p-6">
                                <div>
                                    <label className="game-label text-yellow-500 mb-1 block font-fredoka text-lg text-[shadow:1px_1px_0_#000]">Username</label>
                                    <input
                                        className="form-control w-full px-4 py-3 rounded-xl border-2 border-white bg-white/90 focus:bg-white focus:border-yellow-400 outline-none font-bold text-gray-800 transition-colors"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        required
                                        disabled={!!editingId}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="game-label text-yellow-500 mb-1 block font-fredoka text-lg text-[shadow:1px_1px_0_#000]">
                                        Password {editingId && <span className="text-sm text-gray-300 font-normal ml-1">(Kosongkan jika tidak ubah)</span>}
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control w-full px-4 py-3 rounded-xl border-2 border-white bg-white/90 focus:bg-white focus:border-yellow-400 outline-none font-bold text-gray-800 transition-colors"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        required={!editingId}
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div>
                                    <label className="game-label text-yellow-500 mb-1 block font-fredoka text-lg text-[shadow:1px_1px_0_#000]">Nama Lengkap</label>
                                    <input
                                        className="form-control w-full px-4 py-3 rounded-xl border-2 border-white bg-white/90 focus:bg-white focus:border-yellow-400 outline-none font-bold text-gray-800 transition-colors"
                                        placeholder="Nama Lengkap"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="game-label text-yellow-500 mb-1 block font-fredoka text-lg text-[shadow:1px_1px_0_#000]">Email</label>
                                    <input
                                        className="form-control w-full px-4 py-3 rounded-xl border-2 border-white bg-white/90 focus:bg-white focus:border-yellow-400 outline-none font-bold text-gray-800 transition-colors"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="game-label text-yellow-500 mb-1 block font-fredoka text-lg text-[shadow:1px_1px_0_#000]">Kelas</label>
                                    <input
                                        className="form-control w-full px-4 py-3 rounded-xl border-2 border-white bg-white/90 focus:bg-white focus:border-yellow-400 outline-none font-bold text-gray-800 transition-colors"
                                        placeholder="Kelas"
                                        value={formData.kelas}
                                        onChange={e => setFormData({ ...formData, kelas: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="game-label text-yellow-500 mb-1 block font-fredoka text-lg text-[shadow:1px_1px_0_#000]">Sekolah</label>
                                    <input
                                        className="form-control w-full px-4 py-3 rounded-xl border-2 border-white bg-white/90 focus:bg-white focus:border-yellow-400 outline-none font-bold text-gray-800 transition-colors"
                                        placeholder="Sekolah"
                                        value={formData.schoolName}
                                        onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-center space-x-4 mt-8 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-fredoka py-3 rounded-full border-b-4 border-gray-700 shadow-lg active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-fredoka py-3 rounded-full border-b-4 border-green-700 shadow-lg active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm grid place-items-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="w-full max-w-sm relative animate-[popIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute -top-4 -right-4 bg-yellow-400 hover:bg-yellow-300 text-red-600 border-4 border-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg z-50 hover:scale-110 active:scale-95 transition-transform"
                            style={{ boxShadow: '0 4px 0 #f57f17' }}
                        >
                            X
                        </button>

                        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border-8 border-red-500">
                            <div className="bg-red-500 p-4 text-center border-b-4 border-red-700">
                                <h3 className="text-2xl font-black text-white font-fredoka uppercase tracking-wider text-[shadow:2px_2px_0_#000]">
                                    HAPUS SISWA?
                                </h3>
                            </div>

                            <div className="p-8 text-center bg-red-50">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <p className="text-gray-800 font-bold text-lg mb-2">Apakah Anda yakin?</p>
                                <p className="text-gray-600 text-sm">Data siswa yang dihapus tidak dapat dikembalikan lagi.</p>
                            </div>

                            <div className="bg-gray-100 p-5 flex justify-center gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-bold shadow-md transition-transform active:scale-95 border-b-4 border-gray-700"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold shadow-md transition-transform active:scale-95 border-b-4 border-red-700"
                                >
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    )
}
