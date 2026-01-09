# Kita - Your Personal Bento Page

[English](#english) | [中文](#chinese)

![Kita Banner](public/og-image.png)

## English

**Kita** is a modern, personalized page builder inspired by Bento.me. It allows you to create a beautiful, grid-based profile to showcase your links, thoughts, and portfolio.

### Features

-   **Bento Grid Layout**: Flexible, drag-and-drop grid system.
-   **Theming**: One-click theme switching with Dark/Light mode support.
-   **Modules**: Rich content modules including Text, Images, Links, and more.
-   **Instant**: Built on Next.js for blazing fast performance.
-   **Customizable**: Adjust colors, border radius, and typography.

### Tech Stack

-   **Framework**: Next.js 14+ (App Router)
-   **Styling**: Tailwind CSS, Shadcn UI
-   **Database**: SQLite (via Turso/LibSQL), Drizzle ORM
-   **Auth**: NextAuth.js (or custom implementation)
-   **Animations**: Framer Motion

### Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/kita.git
    cd kita
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup**:
    Create a `.env.local` file in the root directory and add your environment variables:
    ```env
    DATABASE_URL="file:local.db" # or your Turso URL
    NEXTAUTH_SECRET="your-secret"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```

### License

MIT License.

---

<a id="chinese"></a>

## 中文 (Chinese)

**Kita** 是一個現代化、受 Bento.me 啟發的個人頁面建構工具。它讓您可以輕鬆創建精美的網格狀個人主頁，展示您的連結、想法和作品集。

### 功能特色

-   **Bento 網格佈局**：靈活的拖放式網格系統。
-   **多樣化主題**：一鍵切換多種配色主題，並完全支援深色/淺色模式 (Dark/Light Mode)。
-   **豐富模組**：包含文字、圖片、連結等多種內容模組。
-   **極速體驗**：基於 Next.js 構建，效能極佳。
-   **高度客製化**：可調整顏色、圓角和字型設定。

### 技術棧

-   **框架**: Next.js 14+ (App Router)
-   **樣式**: Tailwind CSS, Shadcn UI
-   **資料庫**: SQLite (使用 Turso/LibSQL), Drizzle ORM
-   **認證**: NextAuth.js
-   **動畫**: Framer Motion

### 快速開始

1.  **複製專案**:
    ```bash
    git clone https://github.com/yourusername/kita.git
    cd kita
    ```

2.  **安裝依賴**:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **環境設定**:
    在根目錄建立 `.env.local` 檔案並填入環境變數：
    ```env
    DATABASE_URL="file:local.db" # 或您的 Turso URL
    NEXTAUTH_SECRET="your-secret"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **啟動開發伺服器**:
    ```bash
    npm run dev
    ```

5.  **生產環境構建**:
    ```bash
    npm run build
    npm start
    ```

### 授權

MIT License.
