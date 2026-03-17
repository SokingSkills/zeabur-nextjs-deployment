---
name: zeabur-deployment
description: Zeabur 部署指南 — 適用於 soking.cc 的 Vite + Express 架構。涵蓋部署流程、import 防護、Dockerfile 驗證、常見故障排除。當提到 Zeabur 部署、正式站崩潰、push 到 main 等情境時觸發。
---

# Zeabur 部署指南（Vite + Express）

## 專案部署架構

| 項目 | 值 |
|------|-----|
| 平台 | Zeabur（非 Vercel） |
| Domain | `soking.cc` |
| 觸發方式 | 推送 `main` 分支自動部署 |
| 啟動指令 | `tsx server/production.ts` |
| Port | `8080`（Zeabur 預設） |
| 建置方式 | Dockerfile（node:22-alpine） |

### 關鍵檔案

- `Dockerfile` — 生產 Docker 映像（含 import 驗證）
- `zeabur.json` — Zeabur 建置設定（`buildCommand`、`installCommand`）
- `server/production.ts` — Express 伺服器入口，統一管理所有 API 路由
- `dist/` — Vite 預建置的前端靜態檔

---

## 部署流程

```
npm run build → git push main → Zeabur 偵測 Dockerfile →
Docker build（npm install --omit=dev → COPY dist/ → 驗證 import） →
CMD npm start → tsx server/production.ts → :8080
```

### zeabur.json 設定

```json
{
  "buildCommand": "npm run build && npm run index:build",
  "installCommand": "npm install --omit=dev --legacy-peer-deps"
}
```

---

## ⚠️ 最重要：Import 防護機制

**正式站崩潰的頭號原因：`server/production.ts` import 了未 commit 的檔案。**

### Dockerfile 驗證步驟

Dockerfile 在 build 階段會執行：

```dockerfile
RUN npx tsx -e "import('./server/production.ts').then(() => { \
  console.log('All server imports resolved'); process.exit(0); \
}).catch(e => { \
  console.error('Import resolution failed:', e.message); process.exit(1); \
})"
```

此步驟確保 `production.ts` 的所有 import 都能正確解析，失敗則中斷部署。

### 新增或修改 API 端點時的 Commit 規則

1. **建立 API handler 檔案**（例如 `api/admin/new-feature.ts`）
2. **在 `server/production.ts` 加入 import 與路由註冊**
3. **兩者必須同時 commit** — 只 commit production.ts 而漏掉新檔案，部署必定失敗

```bash
# 正確做法
git add api/admin/new-feature.ts server/production.ts
git commit -m "feat: add new feature API endpoint"

# 錯誤做法 — 漏掉新建的 handler 檔案
git add server/production.ts  # ❌ 缺少 api/admin/new-feature.ts
```

### 推送前自檢

```bash
# 確認所有被 import 的檔案都在 staged/committed
git status

# 查看 production.ts 最近改動涉及哪些 import
git diff server/production.ts | grep "^+import"

# 本地驗證 import 能否解析
npx tsx -e "import('./server/production.ts')"
```

---

## Dockerfile 解析

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# 必須複製的目錄
COPY dist/ ./dist/           # Vite 前端建置產物
COPY server/ ./server/       # Express 伺服器
COPY api/ ./api/             # API handler
COPY lib/ ./lib/             # 共用函式庫
COPY "開課排程/" "./開課排程/"  # 課程資料

# 驗證 dist 存在
RUN test -d dist && test -f dist/index.html

# 驗證 server import
RUN npx tsx -e "import('./server/production.ts')..."

EXPOSE 8080
CMD ["npm", "start"]
```

**注意事項：**
- `dist/` 必須在本地先 `npm run build` 並 commit 到 Git
- 若新增需要在 runtime 讀取的目錄，須同步更新 Dockerfile 的 `COPY` 指令

---

## 常見問題排解

### 1. 部署後正式站白畫面 / 500 錯誤

**診斷：**
- 檢查 Zeabur Dashboard 的 deploy log
- 搜尋 `Import resolution failed` 或 `Cannot find module`

**原因：** `production.ts` import 了未包含在 Docker image 中的檔案。

**修復：**
```bash
# 找出缺少的檔案
npx tsx -e "import('./server/production.ts')" 2>&1

# 加入遺漏的檔案
git add [missing-file]
git commit -m "fix: add missing file for production import"
git push origin main
```

### 2. Zeabur 未觸發自動部署

```bash
# 方法 A：空 commit 觸發
git commit --allow-empty -m "chore: trigger deployment"
git push origin main

# 方法 B：Zeabur Dashboard → Redeploy
```

### 3. dist/ 找不到（Docker build 失敗）

```
ERROR: dist/ directory not found.
```

```bash
# 本地建置
npm run build

# 確認 dist/ 存在
ls dist/index.html

# 加入並 commit
git add dist/
git commit -m "build: update dist for deployment"
git push origin main
```

### 4. 新增 Dockerfile COPY 目錄

若新增了 production 需要的目錄（例如新的資料夾），需更新 Dockerfile：

```dockerfile
# 在現有 COPY 指令後加入
COPY "新目錄/" "./新目錄/"
```

### 5. 環境變數問題

Zeabur 環境變數在 Dashboard → Service → Variables 設定。
`production.ts` 透過 `dotenv` 載入 `.env.local` 和 `.env`：

```typescript
dotenv.config({ path: join(__dirname, '..', '.env.local'), override: true });
dotenv.config({ override: true });
```

**常用環境變數：** `SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`、`ANTHROPIC_API_KEY`、`SENTRY_DSN`、`ZEABUR_EMAIL_API_KEY`

---

## 部署前完整檢查清單

```bash
# 1. 確認 production.ts 的所有 import 可解析
npx tsx -e "import('./server/production.ts')"

# 2. 確認 dist/ 為最新
npm run build

# 3. 確認沒有遺漏的檔案
git status
# 特別注意 Untracked files 中是否有 api/、lib/、server/ 下的新檔案

# 4. 確認只 stage 相關檔案（不要 git add -A）
git add [specific files]

# 5. 推送
git push origin main

# 6. 在 Zeabur Dashboard 確認部署狀態
```

---

## 新增 API 端點的標準流程

1. 建立 handler：`api/[domain]/[feature].ts`
2. 在 `server/production.ts` 加入 import 和路由註冊
3. 在 `server/dev-server.js` 加入對應路由（開發環境）
4. 同時 commit 以上所有檔案
5. 推送 main 觸發部署
