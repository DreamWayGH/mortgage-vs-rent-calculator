# 房貸 vs 租房+投資 比較計算機

純前端 React 計算機，協助使用者並列比較「買房 vs 租房+ETF投資」在不同參數下的長期財務結果。

詳細需求請見 [REQUIREMENTS.md](REQUIREMENTS.md)。

## 技術棧

- React 19（Create React App）
- MUI（待安裝）
- TailwindCSS（待安裝）

## 開發指令

```bash
npm install      # 安裝相依套件
npm start        # 啟動開發伺服器 http://localhost:3000
npm run build    # 產生 production build
npm test         # 執行測試
```

## 專案結構

```
mortgage-vs-rent-calculator/
├── public/                              # 靜態資源
├── REQUIREMENTS.md                      # 需求規格文件
├── README.md
├── package.json
└── src/
    ├── index.js                         # React 進入點
    ├── index.css                        # 全域樣式
    ├── App.js                           # 根元件（組合 Header / InputForm / ComparisonTable）
    │
    ├── components/                      # UI 元件
    │   ├── Layout/
    │   │   └── Header.jsx               # 頁面標題列（預留深色模式 / 圖表切換按鈕）
    │   │
    │   ├── InputForm/                   # 輸入區（REQUIREMENTS 二）
    │   │   ├── InputForm.jsx            # 表單容器、計算 / 清除全部
    │   │   ├── HouseLoanFields.jsx      # 2.1 房屋與貸款欄位
    │   │   ├── RentFields.jsx           # 2.2 租房方案欄位
    │   │   ├── InvestmentFields.jsx     # 2.3 投資假設欄位
    │   │   └── AppreciationFields.jsx   # 2.4 增值假設欄位
    │   │
    │   └── ComparisonTable/             # 比較結果區（REQUIREMENTS 四）
    │       ├── ComparisonTable.jsx      # 4.1 比較總表
    │       ├── ComparisonRow.jsx        # 單一比較列（含勝出標色、刪除 / 展開）
    │       └── DetailTable.jsx          # 4.2 每 5 年明細子表格
    │
    ├── hooks/
    │   └── useScenarios.js              # 管理比較結果列表 state（add/remove/clearAll/toggleExpand）
    │
    ├── utils/                           # 純函式計算與格式化
    │   ├── mortgage.js                  # 3.1 房貸計算（本息均攤、寬限期、明細）
    │   ├── investment.js                # 3.2 租房 / 買房 雙方 ETF 投資計算
    │   └── formatters.js                # 千分位、萬、百分比格式化
    │
    └── constants/
        └── defaults.js                  # 輸入欄位預設值
```

## 開發狀態

目前為架構骨架，各元件與計算函式皆已就位但尚未實作細節（檔案內以 `TODO` 註解標示對應 REQUIREMENTS 章節）。
