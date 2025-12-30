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
    "7": {
        title: "LEVEL 7: BALON HARAPAN",
        questions: [
            { id: "balloon_1", label: "Balon 1" },
            { id: "balloon_2", label: "Balon 2" },
            { id: "balloon_3", label: "Balon 3" },
            { id: "balloon_4", label: "Balon 4" },
            { id: "balloon_5", label: "Balon 5" }
        ]
    },
    "8": {
        title: "LEVEL 8: REFLEKSI DIRI",
        questions: [
            { id: "reflection", label: "Refleksi" }
        ]
    },
    "9": {
        title: "LEVEL 9",
        questions: [
            { id: "input_1", label: "Jawaban 1" },
            { id: "input_2", label: "Jawaban 2" },
            { id: "input_3", label: "Jawaban 3" }
        ]
    },
    "10": {
        title: "LEVEL 10: RINGS",
        questions: [
            { id: "ring_1", label: "Ring 1" },
            { id: "ring_2", label: "Ring 2" },
            { id: "ring_4", label: "Ring 4" },
            { id: "ring_5", label: "Ring 5" }
        ]
    },
    "11": {
        title: "LEVEL 11",
        questions: [
            { id: "circle_input", label: "Jawaban" }
        ]
    },
    "12": {
        title: "LEVEL 12: REFLEKSI CERMIN",
        questions: [
            { id: "mirror_input", label: "Refleksi" }
        ]
    },
    // Generated Levels 13-30
    ...Array.from({ length: 18 }, (_, i) => i + 13).reduce((acc, level) => ({
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
