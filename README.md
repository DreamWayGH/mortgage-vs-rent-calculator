# 房貸 vs 租房 + 投資 比較計算機

一個以 React 撰寫的前端應用，用於比較「買房（房貸）」與「租房並將差額投入投資（例如 ETF）」在不同參數下的長期財務結果。

詳細需求與功能規格請見 [REQUIREMENTS.md](REQUIREMENTS.md)。

**主要用途**
- 幫助使用者在同一套假設下並列比較兩種方案的淨資產變化（含現金流、投資累積、房屋淨值等）。

**特色**
- 可調整房價、貸款利率、貸款年限、頭期款、租金與租金成長率、投資年化報酬等參數。
- 同時顯示摘要比較表與分年（或每 5 年）明細表。

## 技術棧

- React（Create React App 範式）
- Tailwind CSS（樣式）
- 純前端計算函式：位於 `src/utils/`

## 快速開始（開發）

1. 安裝依賴

```bash
npm install
```

2. 啟動開發伺服器（預設 http://localhost:3000）

```bash
npm start
```

3. 建置 production 檔案

```bash
npm run build
```

（選用）在本機以靜態伺服器檢視 `build/` 輸出：

```bash
npx serve build
```

## 專案結構（重點檔案）

```
package.json
public/                # 靜態資源
src/
    ├─ index.js          # 應用進入點
    ├─ App.js            # 根元件，組合輸入表單與比較顯示
    ├─ index.css
    ├─ components/
    │   ├─ Layout/Header.jsx
    │   ├─ InputForm/    # 輸入欄位與表單元件
    │   └─ ComparisonTable/  # 結果表格與明細
    ├─ utils/            # 計算邏輯與格式化工具
    ├─ hooks/            # 自訂 Hook（資料管理）
    └─ constants/        # 預設值
```

常用檔案：
- `src/utils/mortgage.js`：房貸分期、利息與本金明細計算。
- `src/utils/investment.js`：租房後可投資金額的模擬與累積計算。
- `src/components/InputForm`：使用者輸入參數的表單。
- `src/components/ComparisonTable`：顯示比較結果與明細表。

## 開發注意事項
- 部分元件或計算細節以 `TODO` 註記，請參考檔案內註解與 `REQUIREMENTS.md` 作為實作依據。
- 若要新增樣式或元件，請遵循現有的 Tailwind CSS 設計概念。

## 佈署
- 建置後將 `build/` 目錄內容部署到任何靜態網站托管服務（Netlify、Vercel、GitHub Pages 等）。

## 貢獻
- 歡迎開 issue 或 pull request。請描述你想加入的功能或修正的 bug，並附上重現步驟。

---

已更新本檔以反映當前代碼庫結構與使用指引，更多技術細節請參考 `src/` 目錄與 `REQUIREMENTS.md`。
