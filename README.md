# Kita - Your Personal Bento Page

[English](#english) | [中文](#chinese)

![Kita Banner](public/og-image.png)

## English

**Kita** is a modern, personalized page builder inspired by Bento.me. It allows you to create a beautiful, grid-based profile to showcase your links, thoughts, and portfolio.

### Features

-   **Bento Grid Layout**: Flexible, drag-and-drop grid system powered by `react-grid-layout`.
-   **Theming**: One-click theme switching with Dark/Light mode support.
-   **Modules**: Rich content modules including Text, Images, Links, and Custom Markdown.
-   **Instant**: Built on Next.js 15 for blazing fast performance.
-   **Customizable**: Adjust colors, border radius, and typography.
-   **Demo Mode**: Try it out without signing up at `/demo`.
-   **Invite System**: Optional closed-alpha invitation system.

### Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Styling**: Tailwind CSS, Shadcn UI
-   **Database**: SQLite (via Turso/LibSQL), Drizzle ORM
-   **Auth**: Better Auth
-   **State Management**: React Context & Local State (for Demo)

### Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/kita.git
    cd kita
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env.local` file in the root directory:
    ```env
    DATABASE_URL="file:local.db"
    BETTER_AUTH_SECRET="your-secret"
    BETTER_AUTH_URL="http://localhost:3000"
    
    # Cloudflare R2 (Optional, for image uploads)
    R2_BUCKET_NAME=""
    R2_ACCOUNT_ID=""
    R2_ACCESS_KEY_ID=""
    R2_SECRET_ACCESS_KEY=""
    R2_PUBLIC_DOMAIN=""
    
    # Invitation System (Optional, defaults to true)
    NEXT_PUBLIC_ENABLE_INVITE_SYSTEM=true 
    ```

4.  **Database Migration**:
    ```bash
    npm run db:push
    ```

5.  **Seed Invites (Optional)**:
    If enabling the invite system, generate initial codes:
    ```bash
    npx tsx scripts/seed-invites.ts
    ```

6.  **Run Development Server**:
    ```bash
    npm run dev
    ```

7.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```

### Invite System

To control access to your instance:
-   **Enable**: Set `NEXT_PUBLIC_ENABLE_INVITE_SYSTEM=true` in `.env.local`.
-   **Disable**: Set to `false`.
-   **Manage Codes**: Use `scripts/seed-invites.ts` to add codes, or check `unused-invites.txt` (if generated) for available codes.

### License

MIT License.

---

<a id="chinese"></a>

## 中文 (Chinese)

**Kita** 是一個現代化、受 Bento.me 啟發的個人頁面建構工具。它讓您可以輕鬆創建精美的網格狀個人主頁，展示您的連結、想法和作品集。

### 功能特色

-   **Bento 網格佈局**：基於 `react-grid-layout` 的靈活拖放式網格系統。
-   **多樣化主題**：一鍵切換多種配色主題，並完全支援深色/淺色模式 (Dark/Light Mode)。
-   **豐富模組**：包含文字、圖片、連結以及自定義 Markdown 模組。
-   **極速體驗**：基於 Next.js 15 構建，效能極佳。
-   **高度客製化**：可調整顏色、圓角和字型設定。
-   **試用模式**：無需註冊即可在 `/demo` 體驗編輯器。
-   **邀請制度**：可選的封閉測試邀請系統。

### 技術棧

-   **框架**: Next.js 15 (App Router)
-   **樣式**: Tailwind CSS, Shadcn UI
-   **資料庫**: SQLite (使用 Turso/LibSQL), Drizzle ORM
-   **認證**: Better Auth
-   **狀態管理**: React Context & Local State

### 快速開始

1.  **複製專案**:
    ```bash
    git clone https://github.com/yourusername/kita.git
    cd kita
    ```

2.  **安裝依賴**:
    ```bash
    npm install
    ```

3.  **環境設定**:
    在根目錄建立 `.env.local` 檔案並填入環境變數：
    ```env
    DATABASE_URL="file:local.db"
    BETTER_AUTH_SECRET="your-secret"
    BETTER_AUTH_URL="http://localhost:3000"
    
    # Cloudflare R2 (選填，用於圖片上傳)
    R2_BUCKET_NAME=""
    R2_ACCOUNT_ID=""
    R2_ACCESS_KEY_ID=""
    R2_SECRET_ACCESS_KEY=""
    R2_PUBLIC_DOMAIN=""
    
    # 邀請系統 (選填，預設為開啟 true)
    NEXT_PUBLIC_ENABLE_INVITE_SYSTEM=true 
    ```

4.  **資料庫遷移**:
    ```bash
    npm run db:push
    ```

5.  **生成邀請碼 (可選)**:
    如需啟用邀請制，請執行此腳本生成初始代碼：
    ```bash
    npx tsx scripts/seed-invites.ts
    ```

6.  **啟動開發伺服器**:
    ```bash
    npm run dev
    ```

7.  **生產環境構建**:
    ```bash
    npm run build
    npm start
    ```

### 邀請系統

若要控制註冊權限：
-   **開啟**：在 `.env.local` 設定 `NEXT_PUBLIC_ENABLE_INVITE_SYSTEM=true`。
-   **關閉**：設定為 `false`。
-   **管理代碼**：修改 `scripts/seed-invites.ts` 新增代碼，或查看 `unused-invites.txt` (若有生成) 獲取可用代碼。

### 授權

MIT License.
