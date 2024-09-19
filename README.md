# Project - Taipei-Day-Trip

> 本專案以台北資料大平台之台北景點作為資料根據，建立一個台北影點的一日導覽電商網站，內容包含：

1.首頁瀏覽、查詢景點 2.景點頁面查看景點資訊及預約資訊 3.連結 Tappay 金流服務，可用測試的信用卡進行付款功能

## [台北一日遊](http://18.176.26.217:8000/)

Test User : oqkqrw8ulg@expressletter.net  
Password : 123456

Credit Card : 4242-4242-4242-4242  
Date : 01/30  
CVV : 123

也可自行註冊帳密使用(註冊需驗證信箱)

## 使用技術

- 前端用 React 編寫
- 後端用 Python FastAPI
- React router 路由控制
- Redux 狀態控制
- RESTful API 架構實踐專案功能
- 基於 Figma 設計製作 UI 介面
- 資料存於 MySQL，利用 index 加速搜尋
- 使用 SQLAlchemy 操作 MySQL
- 結合 TapPay SDK 建立付款功能
- 專案建構於 AWS EC2

## 網頁功能

### 首頁瀏覽

- 滾輪往下，一次 lazy loading 12 筆資料。或是於搜尋欄搜尋
  ![r1](/readIMG/R1.png)
- 點擊捷運站名，可搜尋相關景點

### 帳號管理

- 使用者可註冊自己的帳號密碼已使用網站
  ![r2](/readIMG/R2.png)

### 行程預約

- 使用者於登入後可以在景點頁面點擊預約選項
  ![r3](/readIMG/R3.png)
- 在預約頁面執行付款功能
  ![r4](/readIMG/R4.png)
