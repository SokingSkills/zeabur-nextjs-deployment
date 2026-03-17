---
name: zeabur-deployment
description: Zeabur 部署指南 — 涵蓋兩種架構：(A) Vite + Express 全端應用（soking.cc）、(B) 純靜態 SPA（Vite + React + Caddy）。包含部署流程、Dockerfile 模板、import 防護、npm peer dependency 衝突處理、TypeScript 構建錯誤排解、常見故障排除。當提到 Zeabur 部署、正式站崩潰、push 到 main、Docker build 失敗、404 白畫面等情境時觸發。
---

# Zeabur 部署指南

## 架構總覽

本指南涵蓋兩種部署模式：

| | 模式 A：全端應用 | 模式 B：純靜態 SPA |
|---|---|---|
| 範例 | soking.cc | FinOS 財策長 Demo |
| 前端 | Vite + React | Vite + React |
| 後端 | Express（tsx） | 無（純靜態） |
| 靜態服務 | Express serve dist/ | Caddy |
| Docker base | node:22-alpine | node:20-alpine → caddy:2-alpine |
| Port | 8080 | 80 |
| 啟動 | `tsx server/production.ts` | Caddy 自動啟動 |

---

## 模式 A：Vite + Express 全端應用

### 專案部署架構

| 項目 | 值 |
|------|-----|
| 平台 | Zeabur |
| Domain | `soking.cc` |
| 觸發方式 | 推送 `main` 分支自動部署 |
| 啟動指令 | `tsx server/production.ts` |
| Port | `8080`（Zeabur 預設） |
| 建置方式 | Dockerfile（node:22-alpine） |

### 關鍵檔案

- `Dockerfile` — 生產 Docker 映像（含 import 驗證）
- `zeabur.json` — Zeabur 建置設定
- `server/production.ts` — Express 伺服器入口
- `dist/` — Vite 前端建置產物

### 部署流程

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

### Dockerfile 範本

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

COPY dist/ ./dist/
COPY server/ ./server/
COPY api/ ./api/
COPY lib/ ./lib/

# 驗證 dist 存在
RUN test -d dist && test -f dist/index.html

# 驗證 server import
RUN npx tsx -e "import('./server/production.ts').then(() => { \
  console.log('All server imports resolved'); process.exit(0); \
}).catch(e => { \
  console.error('Import resolution failed:', e.message); process.exit(1); \
})"

EXPOSE 8080
CMD ["npm", "start"]
```

### ⚠️ Import 防護機制

**正式站崩潰的頭號原因：`server/production.ts` import 了未 commit 的檔案。**

新增或修改 API 端點時：
1. 建立 API handler 檔案
2. 在 `server/production.ts` 加入 import 與路由
3. **兩者必須同時 commit**

```bash
# 正確
git add api/admin/new-feature.ts server/production.ts

# 錯誤 — 漏掉新建的 handler
git add server/production.ts  # ❌
```

---

## 模式 B：純靜態 SPA（Vite + React + Caddy）

### 適用場景

- 純前端應用（無後端 API）
- React SPA 需要 client-side routing（try_files fallback）
- 使用 Zeabur 的 Docker 部署

### Dockerfile 範本（多階段構建）

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY --from=builder /app/dist /usr/share/caddy
COPY <<'EOF' /etc/caddy/Caddyfile
:80 {
    root * /usr/share/caddy
    try_files {path} /index.html
    file_server
    encode gzip
}
EOF
EXPOSE 80
```

**關鍵要點：**
- **必須用多階段構建**：在 builder 階段 `npm ci` + `npm run build`，再將 `dist/` 複製到 Caddy
- **`try_files {path} /index.html`**：SPA 必要，確保 React Router 的子路由不會 404
- **不要用 `zeabur/caddy-static`**：它不會執行構建步驟，只適合預構建的靜態檔案
- **`encode gzip`**：啟用壓縮，改善載入速度

### 常見失敗：使用 zeabur/caddy-static 但無構建

如果 Zeabur 自動偵測使用 `zeabur/caddy-static`，它只會 clone 源碼但不會執行 `npm install` 或 `npm run build`，導致 `/usr/share/caddy` 為空，所有請求返回 404。

**解法：** 提供自定義 Dockerfile（如上範本）。

---

## 🔧 npm / TypeScript 構建錯誤排解

### Peer Dependency 衝突

**症狀：**
```
npm error ERESOLVE unable to resolve dependency tree
npm error peer vite@"^5.2.0 || ^6 || ^7" from @tailwindcss/vite@4.2.1
```

**原因：** 套件的 peer dependency 版本範圍不相容。例如 `@tailwindcss/vite@4.x` 不支援 `vite@8`。

**排解步驟：**
1. **確認 package-lock.json 與 package.json 一致** — 本地 `npm install` 後重新 commit lock file
2. **升級不相容的套件** — `npm install @tailwindcss/vite@latest`
3. **降級主套件** — 若最新版 plugin 仍不支援，降級 vite 至相容版本
4. **最後手段** — 在 Dockerfile 中用 `npm ci --legacy-peer-deps`（不推薦，可能產生運行時問題）

**預防：**
- `package.json` 的版本範圍要和實際安裝版本一致
- 每次 `npm install` 後都要 commit `package-lock.json`
- CI/CD 環境用 `npm ci`（嚴格按 lock file 安裝）

### TypeScript 型別錯誤（recharts 等第三方庫）

**症狀：**
```
error TS2322: Type '(value: number) => string' is not assignable to type 'Formatter<ValueType, NameType>'
```

**常見於 recharts Tooltip formatter：**

```tsx
// ❌ 錯誤 — value 可能為 undefined
<Tooltip formatter={(value) => formatCurrency(Number(value))} />

// ✅ 正確 — 明確標注 value 為 unknown
<Tooltip formatter={(value: unknown) => formatCurrency(Number(value))} />
```

**recharts Pie label 型別：**

```tsx
// ❌ 錯誤 — name 可能為 undefined
label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}

// ✅ 正確 — 處理可選型別
label={({ name, percent }: { name?: string; percent?: number }) =>
  `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
```

**通用原則：** 第三方庫回調的參數型別通常包含 `undefined`，不要假設一定有值。

### Build 成功但部署後 404

**診斷清單：**
1. Dockerfile 有沒有正確 `COPY --from=builder /app/dist`？
2. Caddy 的 `root` 路徑是否正確？
3. 是否缺少 `try_files` 導致 SPA 子路由 404？
4. Docker build log 中 `npm run build` 是否真的產出了 `dist/`？

---

## 部署前完整檢查清單

### 模式 A（全端）

```bash
# 1. 驗證 server import
npx tsx -e "import('./server/production.ts')"

# 2. 建置前端
npm run build

# 3. 檢查未 commit 的檔案
git status

# 4. 推送
git push origin main
```

### 模式 B（純靜態）

```bash
# 1. 本地建置驗證
npm run build  # 確認無 TypeScript 錯誤

# 2. 本地 Docker 測試（可選）
docker build -t test-app . && docker run -p 8080:80 test-app

# 3. 確認 package-lock.json 已 commit
git status

# 4. 推送
git push origin main
```

---

## 常見問題排解

### 1. 部署後白畫面 / 500

- **模式 A：** 檢查 `production.ts` import，搜尋 `Cannot find module`
- **模式 B：** 檢查 Dockerfile 是否正確複製 `dist/` 到 Caddy 目錄

### 2. Zeabur 未觸發自動部署

```bash
git commit --allow-empty -m "chore: trigger deployment"
git push origin main
```

### 3. dist/ 找不到

確認 `npm run build` 在 Dockerfile 的 builder 階段執行，且 `COPY --from=builder` 路徑正確。

### 4. 環境變數

Zeabur Dashboard → Service → Variables。常用：`SUPABASE_URL`、`ANTHROPIC_API_KEY`、`SENTRY_DSN`

### 5. npm ci 失敗（peer deps）

在 Dockerfile 中暫時改為：
```dockerfile
RUN npm ci --legacy-peer-deps
```
但應儘快修正 package.json 中的版本衝突。

---

## 新增 API 端點標準流程（模式 A）

1. 建立 handler：`api/[domain]/[feature].ts`
2. 在 `server/production.ts` 加入 import 和路由
3. 在 `server/dev-server.js` 加入對應路由
4. 同時 commit 所有相關檔案
5. 推送 main 觸發部署

## 新 Repo 部署標準流程（模式 B）

1. 確認 `package.json` 的 `build` script 能正確產出 `dist/`
2. 建立 Dockerfile（多階段構建 + Caddy）
3. 確認 `.gitignore` 包含 `node_modules` 和 `dist`
4. 推送到 GitHub repo
5. 在 Zeabur 連結 repo，選擇 Docker 部署
