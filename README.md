# Kita

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
-   **Invite System**: Optional closed-alpha invitation system with CLI management tools.

### Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Styling**: Tailwind CSS, Shadcn UI
-   **Database**: SQLite (via Turso/LibSQL), Drizzle ORM
-   **Auth**: Better Auth
-   **Deployment**: Vercel / Docker ready

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
    Create a `.env.local` file in the root directory (see `.env.example`):
    ```env
    # Database (Defaults to local file)
    DATABASE_URL="file:local.db"
    
    # Auth
    BETTER_AUTH_SECRET="your-secret-base64-string"
    BETTER_AUTH_URL="http://localhost:3000"
    
    # Invite System (Optional, defaults to false if unset)
    NEXT_PUBLIC_ENABLE_INVITE_SYSTEM=true 
    ```

4.  **Run Development Server**:
    The development command strictly checks and pushes database schema changes automatically.
    ```bash
    npm run dev
    ```
    *Note: If using `file:local.db`, the database file will be created automatically on first run.*

### Database Configuration

**Local (Default)**
Uses a local SQLite file. Safe for development but not recommended for serverless deployment.
```env
DATABASE_URL="file:local.db"
```

**Remote (Turso)**
Uses LibSQL/Turso for production-grade database hosting.
```env
DATABASE_URL="libsql://your-db.turso.io"
DATABASE_AUTH_TOKEN="your-auth-token"
```

### Invite System Management

If `NEXT_PUBLIC_ENABLE_INVITE_SYSTEM=true` is set, new users will require an invite code to register.

**Manage invites via CLI:**
```bash
# List all invites
npx tsx scripts/invites.ts list

# Create a specific code
npx tsx scripts/invites.ts create MY-CODE-123

# Generate a random code
npx tsx scripts/invites.ts generate

# Delete a code
npx tsx scripts/invites.ts delete MY-CODE-123
```

**Manage via GUI:**
You can also use Drizzle Studio to manage invites and other data directly:
```bash
npx drizzle-kit studio
```

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
-   **邀請制度**：可選的封閉測試邀請系統，附帶命令行管理工具。

### 技術棧

-   **框架**: Next.js 15 (App Router)
-   **樣式**: Tailwind CSS, Shadcn UI
-   **資料庫**: SQLite (使用 Turso/LibSQL), Drizzle ORM
-   **認證**: Better Auth
-   **部署**: 支援 Vercel / Docker

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
    在根目錄建立 `.env.local` 檔案 (參考 `.env.example`)：
    ```env
    # 資料庫 (預設使用本地檔案)
    DATABASE_URL="file:local.db"
    
    # 認證
    BETTER_AUTH_SECRET="您的隨機密鑰"
    BETTER_AUTH_URL="http://localhost:3000"
    
    # 邀請系統 (選填，若需要設為 true)
    NEXT_PUBLIC_ENABLE_INVITE_SYSTEM=true 
    ```

4.  **啟動開發伺服器**:
    啟動指令會自動同步資料庫架構 (Schema)，無需手動遷移。
    ```bash
    npm run dev
    ```
    *注意：如果是第一次運行，系統會自動生成 `local.db` 檔案。*

### 資料庫設定

**本地 (預設)**
使用本地 SQLite 檔案，適合開發環境。
```env
DATABASE_URL="file:local.db"
```

**遠端 (Turso)**
使用 LibSQL/Turso 雲端資料庫，適合生產環境部署。
```env
DATABASE_URL="libsql://your-db.turso.io"
DATABASE_AUTH_TOKEN="your-auth-token"
```

### 邀請系統管理

如果設定了 `NEXT_PUBLIC_ENABLE_INVITE_SYSTEM=true`，新用戶註冊時將需要填寫邀請碼。

**使用 CLI 管理邀請碼：**
```bash
# 查看所有邀請碼
npx tsx scripts/invites.ts list

# 創建特定邀請碼
npx tsx scripts/invites.ts create VIP888

# 生成隨機邀請碼
npx tsx scripts/invites.ts generate

# 刪除邀請碼
npx tsx scripts/invites.ts delete VIP888
```

**使用圖形介面 (GUI)：**
您也可以使用 Drizzle Studio 直接管理資料庫中的邀請碼：
```bash
npx drizzle-kit studio
```

### 授權

MIT License.
