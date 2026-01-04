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
    "13": {
        title: "LEVEL 13: EKSPRESI BEBAS",
        questions: [
            { id: "canvas_full", label: "Gambar Bebas" }
        ]
    },
    "14": {
        title: "LEVEL 14: REFLEKSI",
        questions: [
            { id: "box_orange", label: "Kotak Orange" }
        ]
    },
    "15": {
        title: "LEVEL 15: IMAJINASI",
        questions: [
            { id: "cloud_input", label: "Awan" }
        ]
    },
    "16": {
        title: "LEVEL 16: EKSPLORASI",
        questions: [
            { id: "text_input", label: "Jawaban" }
        ]
    },
    "17": {
        title: "LEVEL 17: RENCANA",
        questions: [
            { id: "sticky_1", label: "Note 1" },
            { id: "sticky_2", label: "Note 2" },
            { id: "sticky_3", label: "Note 3" },
            { id: "sticky_4", label: "Note 4" }
        ]
    },
    "18": {
        title: "LEVEL 18: LINGKAR WAKTU",
        questions: [
            { id: "past", label: "Dahulu" },
            { id: "present", label: "Sekarang" },
            { id: "future", label: "Esok" }
        ]
    },
    "19": {
        title: "LEVEL 19: SOUNDTRACK",
        questions: [
            { id: "playlist_visited", label: "Sudah mendengarkan?" }
        ]
    },
    "20": {
        title: "LEVEL 20: PETA BERSYUKUR",
        questions: [
            { id: "grateful_1", label: "Momen 1" },
            { id: "grateful_2", label: "Momen 2" },
            { id: "grateful_3", label: "Momen 3" }
        ]
    },
    // Generated Levels 21-30
    ...Array.from({ length: 10 }, (_, i) => i + 21).reduce((acc, level) => ({
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
