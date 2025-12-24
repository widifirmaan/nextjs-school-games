export const LEVEL_DATA: Record<string, { title: string, questions: { id: string, label: string }[] }> = {
    "1": {
        title: "LEVEL 1: FIND THE WORDS",
        questions: [{ id: "kata_pilihan", label: "Kata Pilihan" }]
    },
    "2": {
        title: "LEVEL 2: SCOOP OF HOPE",
        questions: [
            { id: "harapan", label: "Harapanmu" }
        ]
    },
    "3": {
        title: "LEVEL 3: MATEMATIKA DASAR",
        questions: [
            { id: "1_tambah_1_sama_dengan?", label: "1 + 1 = ?" },
            { id: "Akar_kuadrat_dari_144?", label: "Akar kuadrat dari 144?" }
        ]
    },
    "4": {
        title: "LEVEL 4: PENGETAHUAN UMUM",
        questions: [
            { id: "Planet_terbesar_di_tata_surya?", label: "Planet terbesar di tata surya?" },
            { id: "Hewan_tercepat_di_dunia?", label: "Hewan tercepat di dunia?" }
        ]
    },
    // Generated Levels 5-30
    ...Array.from({ length: 26 }, (_, i) => i + 5).reduce((acc, level) => ({
        ...acc,
        [level.toString()]: {
            title: `LEVEL ${level}: TANTANGAN ${level}`,
            questions: [
                { id: `Level_${level}_Pertanyaan_1`, label: `Pertanyaan 1 untuk Level ${level}?` },
                { id: `Level_${level}_Pertanyaan_2`, label: `Pertanyaan 2 untuk Level ${level}?` }
            ]
        }
    }), {})
}
