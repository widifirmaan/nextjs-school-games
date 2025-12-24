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
        title: "LEVEL 3: POHON HARAPAN",
        questions: [
            { id: "merasa", label: "Aku merasa" },
            { id: "berharap", label: "Aku berharap" },
            { id: "butuh", label: "Aku butuh" },
            { id: "ingin", label: "Aku ingin" }
        ]
    },
    "4": {
        title: "LEVEL 4: MIMPI TERBESAR",
        questions: [
            { id: "mimpi", label: "Tuliskan satu mimpi terbesarmu disini" }
        ]
    },
    "5": {
        title: "LEVEL 5: ANXIETY ELIXIR",
        questions: [
            { id: "elixir_1", label: "Elixir 1" },
            { id: "elixir_2", label: "Elixir 2" },
            { id: "elixir_3", label: "Elixir 3" },
            { id: "elixir_4", label: "Elixir 4" }
        ]
    },
    "6": {
        title: "LEVEL 6: GAMBAR EKSPRESI",
        questions: [
            { id: "face_senang", label: "Wajah Senang" },
            { id: "face_sedih", label: "Wajah Sedih" },
            { id: "face_marah", label: "Wajah Marah" },
            { id: "face_terkejut", label: "Wajah Terkejut" }
        ]
    },
    // Generated Levels 7-30
    ...Array.from({ length: 24 }, (_, i) => i + 7).reduce((acc, level) => ({
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
