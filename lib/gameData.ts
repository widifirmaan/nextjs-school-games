export const LEVEL_DATA: Record<string, { title: string, questions: { id: string, label: string }[] }> = {
    // -----------------------------------------
    // DIMENSION 1: SELF ACCEPTANCE
    // -----------------------------------------
    "1": { // Old 1
        title: "LEVEL 1: FIND THE WORDS",
        questions: [{ id: "kata_pilihan", label: "Kata Pilihan" }]
    },
    "2": { // Old 6
        title: "LEVEL 2: GAMBAR EKSPRESI",
        questions: [
            { id: "face_senang", label: "Wajah Senang" },
            { id: "face_sedih", label: "Wajah Sedih" },
            { id: "face_marah", label: "Wajah Marah" },
            { id: "face_terkejut", label: "Wajah Terkejut" }
        ]
    },
    "3": { // Old 7
        title: "LEVEL 3: BALON HARAPAN",
        questions: [
            { id: "balloon_1", label: "Balon 1" },
            { id: "balloon_2", label: "Balon 2" },
            { id: "balloon_3", label: "Balon 3" },
            { id: "balloon_4", label: "Balon 4" },
            { id: "balloon_5", label: "Balon 5" }
        ]
    },
    "4": { // Old 9
        title: "LEVEL 4",
        questions: [
            { id: "input_1", label: "Jawaban 1" },
            { id: "input_2", label: "Jawaban 2" },
            { id: "input_3", label: "Jawaban 3" }
        ]
    },
    "5": { // Old 10
        title: "LEVEL 5: RINGS",
        questions: [
            { id: "ring_1", label: "Ring 1" },
            { id: "ring_2", label: "Ring 2" },
            { id: "ring_4", label: "Ring 4" },
            { id: "ring_5", label: "Ring 5" }
        ]
    },
    "6": { // Old 12
        title: "LEVEL 6: REFLEKSI CERMIN",
        questions: [
            { id: "mirror_input", label: "Refleksi" }
        ]
    },
    "7": { // Old 14
        title: "LEVEL 7: REFLEKSI",
        questions: [
            { id: "box_orange", label: "Kotak Orange" }
        ]
    },

    // -----------------------------------------
    // DIMENSION 2: ENVIRONMENTAL
    // -----------------------------------------
    "8": { // Old 5
        title: "LEVEL 8: ANXIETY ELIXIR",
        questions: [
            { id: "elixir_1", label: "Elixir 1" },
            { id: "elixir_2", label: "Elixir 2" },
            { id: "elixir_3", label: "Elixir 3" },
            { id: "elixir_4", label: "Elixir 4" }
        ]
    },
    "9": { // Old 11
        title: "LEVEL 9",
        questions: [
            { id: "circle_input", label: "Jawaban" }
        ]
    },
    "10": { // Old 13
        title: "LEVEL 10: EKSPRESI BEBAS",
        questions: [
            { id: "canvas_full", label: "Gambar Bebas" }
        ]
    },
    "11": { // Old 19
        title: "LEVEL 11: SOUNDTRACK",
        questions: [
            { id: "playlist_visited", label: "Sudah mendengarkan?" }
        ]
    },
    "12": { // Old 21
        title: "LEVEL 12: ARE YOU OKAY?",
        questions: [
            { id: "splash_1", label: "Apa yang mengganggumu?" },
            { id: "splash_2", label: "Apa yang kamu rasakan?" },
            { id: "splash_4", label: "Apa yang kamu butuhkan?" },
            { id: "splash_5", label: "Apa harapanmu?" }
        ]
    },

    // -----------------------------------------
    // DIMENSION 3: PERSONAL GROWTH
    // -----------------------------------------
    "13": { // Old 3
        title: "LEVEL 13: POHON HARAPAN",
        questions: [
            { id: "merasa", label: "Aku merasa" },
            { id: "berharap", label: "Aku berharap" },
            { id: "butuh", label: "Aku butuh" },
            { id: "ingin", label: "Aku ingin" }
        ]
    },
    "14": { // Old 4
        title: "LEVEL 14: MIMPI TERBESAR",
        questions: [
            { id: "mimpi", label: "Tuliskan satu mimpi terbesarmu disini" }
        ]
    },
    "15": { // Old 8
        title: "LEVEL 15: REFLEKSI DIRI",
        questions: [
            { id: "reflection", label: "Refleksi" }
        ]
    },
    "16": { // Old 15
        title: "LEVEL 16: IMAJINASI",
        questions: [
            { id: "cloud_input", label: "Awan" }
        ]
    },
    "17": { // Old 17
        title: "LEVEL 17: RENCANA",
        questions: [
            { id: "sticky_1", label: "Note 1" },
            { id: "sticky_2", label: "Note 2" },
            { id: "sticky_3", label: "Note 3" },
            { id: "sticky_4", label: "Note 4" }
        ]
    },
    "18": { // Old 24
        title: "LEVEL 18: TANGGA PERUBAHAN",
        questions: [
            { id: "name_input", label: "My Name is..." },
            { id: "change_goal", label: "Hal yang ingin saya ubah" },
            { id: "change_steps", label: "Langkah-langkahnya" }
        ]
    },
    // Old 25-30 were just generated TANGGA PERUBAHAN duplicates. Let's explicitly define them with new numbers (19-24)
    ...Array.from({ length: 6 }, (_, i) => i + 19).reduce((acc, level) => ({
        ...acc,
        [level.toString()]: {
            title: `LEVEL ${level}: TANGGA PERUBAHAN`,
            questions: [
                { id: "name_input", label: "My Name is..." },
                { id: "change_goal", label: "Hal yang ingin saya ubah" },
                { id: "change_steps", label: "Langkah-langkahnya" }
            ]
        }
    }), {}),

    // -----------------------------------------
    // DIMENSION 4: PURPOSE IN LIFE
    // -----------------------------------------
    "25": { // Old 16
        title: "LEVEL 25: EKSPLORASI",
        questions: [
            { id: "text_input", label: "Jawaban" }
        ]
    },
    "26": { // Old 18
        title: "LEVEL 26: LINGKAR WAKTU",
        questions: [
            { id: "past", label: "Dahulu" },
            { id: "present", label: "Sekarang" },
            { id: "future", label: "Esok" }
        ]
    },
    "27": { // Old 20
        title: "LEVEL 27: PETA BERSYUKUR",
        questions: [
            { id: "grateful_1", label: "Momen 1" },
            { id: "grateful_2", label: "Momen 2" },
            { id: "grateful_3", label: "Momen 3" }
        ]
    },
    "28": { // Old 22
        title: "LEVEL 28: KOMPAS TUJUAN",
        questions: [
            { id: "main_goal", label: "Tuliskan tujuan utamamu minggu ini..." }
        ]
    },
    "29": { // Old 23
        title: "LEVEL 29: SURAT MASA DEPAN",
        questions: [
            { id: "future_letter", label: "Tulis surat untuk dirimu di masa depan..." }
        ]
    },

    // -----------------------------------------
    // DIMENSION 5: POSITIVE RELATIONS
    // -----------------------------------------
    "30": { // Old 2
        title: "LEVEL 30: SCOOP OF HOPE",
        questions: [
            { id: "harapan", label: "Harapanmu" }
        ]
    }
}

export const CHAPTER_NAMES: Record<number, string> = {
    1: 'SELF ACCEPTANCE',
    2: 'ENVIRONMENTAL',
    3: 'PERSONAL GROWTH',
    4: 'PURPOSE IN LIFE',
    5: 'POSITIVE RELATIONS'
};

export const CHAPTER_MAPPING: Record<number, number[]> = {
    1: [1, 2, 3, 4, 5, 6, 7],
    2: [8, 9, 10, 11, 12],
    3: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    4: [25, 26, 27, 28, 29],
    5: [30]
};
