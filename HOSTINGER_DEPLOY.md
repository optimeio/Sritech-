# 🚀 Hostinger Deployment Guide for Sri Tech Engineering

Follow these steps to deploy your website on Hostinger (Business/VPS) using the Node.js selector.

## 1. Local Preparation
Before uploading, ensure your local code is fully built and ready:
- Run `npm run deploy:hostinger` in the root folder.
- This creates the `frontend/dist` folder with the latest Red-Green theme changes.

## 2. Server Setup (Hostinger hPanel)
1. **Navigate to Node.js** under the **Website** category.
2. **Create New Application**:
   - **Service Port**: Default (e.g., 5000)
   - **Application Root**: `/` (or your chosen path)
   - **Application URL**: `sritechengg.in`
   - **Startup File**: `backend/server.js`
   - **Node.js Version**: Select **LTS (20.x or higher)**.

## 3. Environment Variables
In the Hostinger Node.js configuration (or via a `.env` file in the `backend/` folder), set the following:

| Variable | Recommended Value |
|----------|-------------------|
| `PORT` | 5000 (Hostinger usually handles this) |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your MongoDB Cluster connection string |
| `JWT_SECRET` | Keep your secure key |
| `GMAIL_USER` | `sritechengineering8@gmail.com` |
| `GMAIL_APP_PASSWORD` | `tofaisjjqyeeuoel` |
| `OWNER_EMAIL` | `thesmgroups@gmail.com` |
| `FRONTEND_URL` | `https://sritechengg.in` |

## 4. File Upload
Upload the following to your server (zip them for faster upload):
1.  **`backend/`** folder (including `node_modules` or run `npm install` on server).
2.  **`frontend/dist/`** folder.
3.  **`package.json`** from the root.

> [!IMPORTANT]
> The backend is configured to automatically serve the frontend from `../frontend/dist`. Ensure this relative path is maintained on the server.

## 5. Finalizing
1. Once uploaded, click **Run npm install** in hPanel if needed.
2. Click **Start Application**.
3. Visit `sritechengg.in` to verify!

---
**Sri Tech Engineering – Beyond Technology**
