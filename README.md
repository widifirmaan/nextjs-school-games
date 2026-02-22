# 🎮 BukuMedia Next - Java Book Games

**BukuMedia Next** is an interactive, web-based learning platform built with **Next.js**. It provides a series of educational game levels designed to help students in learning and self-reflection, migrating from a legacy Java-based system to a modern web architecture.

![Status](https://img.shields.io/badge/Status-Active_Development-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb)

---

## 📸 Application Showcase

Explore the interactive levels and management dashboards of **BukuMedia Next**.

### Core Interfaces
| | |
|:---:|:---:|
| ![Home](public/screenshots/home.png)<br>**Home Page** | ![Login](public/screenshots/login.png)<br>**Authentication** |
| ![Dashboard Siswa](public/screenshots/dashboard-siswa.png)<br>**Student Dashboard** | ![Dashboard Guru](public/screenshots/dashboard-guru.png)<br>**Teacher Dashboard** |

### Level Gallery
| | | |
|:---:|:---:|:---:|
| ![Level 1](public/screenshots/level-1.png)<br>**Level 1: Word Search** | ![Level 2](public/screenshots/level-2.png)<br>**Level 2: Scoop of Hope** | ![Level 3](public/screenshots/level-3.png)<br>**Level 3: Pohon Harapan** |
| ![Level 4](public/screenshots/level-4.png)<br>**Level 4: Mimpi Terbesar** | ![Level 5](public/screenshots/level-5.png)<br>**Level 5: Anxiety Elixir** | ![Level 6](public/screenshots/level-6.png)<br>**Level 6: Gambar Ekspresi** |
| ![Level 7](public/screenshots/level-7.png)<br>**Level 7: Balon Harapan** | ![Level 8](public/screenshots/level-8.png)<br>**Level 8: Refleksi Diri** | ![Level 9](public/screenshots/level-9.png)<br>**Level 9** |
| ![Level 10](public/screenshots/level-10.png)<br>**Level 10: Rings** | ![Level 11](public/screenshots/level-11.png)<br>**Level 11** | ![Level 12](public/screenshots/level-12.png)<br>**Level 12: Refleksi Cermin** |
| ![Level 13](public/screenshots/level-13.png)<br>**Level 13: Ekspresi Bebas** | ![Level 14](public/screenshots/level-14.png)<br>**Level 14: Refleksi** | ![Level 15](public/screenshots/level-15.png)<br>**Level 15: Imajinasi** |
| ![Level 16](public/screenshots/level-16.png)<br>**Level 16: Eksplorasi** | ![Level 17](public/screenshots/level-17.png)<br>**Level 17: Rencana** | ![Level 18](public/screenshots/level-18.png)<br>**Level 18: Lingkar Waktu** |
| ![Level 19](public/screenshots/level-19.png)<br>**Level 19: Soundtrack** | ![Level 20](public/screenshots/level-20.png)<br>**Level 20: Peta Bersyukur** | ![Level 21](public/screenshots/level-21.png)<br>**Level 21: Are You Okay?** |
| ![Level 22](public/screenshots/level-22.png)<br>**Level 22: Kompas Tujuan** | ![Level 23](public/screenshots/level-23.png)<br>**Level 23: Surat Masa Depan** | ![Level 24](public/screenshots/level-24.png)<br>**Level 24: Tangga Perubahan** |
| ![Level 25](public/screenshots/level-25.png)<br>**Level 25** | | |

---

## 🚀 Features Overview

### 🎮 Gamified Learning
*   **30 Interactive Levels**: Diverse game types including Word Search, Drawing, Reflection Input, and Drag & Drop.
*   **Progress Tracking**: Students can track their level completion and achievements in real-time.
*   **Visual Reflection**: Tools designed for emotional expression and self-discovery.

### 👨‍🏫 Administrative Tools
*   **Teacher Dashboard**: Comprehensive monitor to track student activities, progress, and detailed answers.
*   **Data Management**: Export student results and performance data directly to Excel format.
*   **User Management**: Role-based access control for Students and Teachers via NextAuth.

### 📱 Modern Experience
*   **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices.
*   **Real-time Updates**: Instant feedback and state persistence using MongoDB.

---

## 🛠️ Tech Stack

### Frontend & Framework
*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React

### Backend & Infrastructure
*   **Database**: MongoDB (via Mongoose/Native Driver)
*   **Authentication**: NextAuth.js
*   **Legacy**: Original Java source included for reference.

---

## 📂 Project Structure

```bash
/
├── app/                # Next.js App Router (Pages & API)
│   ├── (auth)/        # Authentication routes
│   ├── dashboard/      # User & Admin dashboards
│   └── levels/         # Game levels implementation
├── lib/               # Shared utilities, DB config, and models
├── public/            # Static assets and screenshots
├── legacy-java/       # Original Java-based project source
├── tailwind.config.ts # Styling configuration
└── tsconfig.json      # TypeScript configuration
```

---

## 📦 Getting Started

### Prerequisites
*   **Node.js 18+**
*   **MongoDB Instance** (Local or Atlas)
*   **.env file** with necessary credentials (DATABASE_URL, NEXTAUTH_SECRET)

### Installation & Development

1.  **Clone the repository**
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    *Open [http://localhost:3000](http://localhost:3000) to view the application.*

### 🔐 Default Credentials
If you have run the seed API (`/api/seed`), you can use the following default accounts:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Teacher** | `guru` | `password` |
| **Student** | `siswa` | `password` |

---

## 👥 Authors

Developed by **Widi Firmaan**.
