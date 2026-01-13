<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1VsjEBHj0Nhe0fjlhWG5NXvviK6_Hjhhw

## 🚀 Run Locally

**Prerequisites:**  
- [Node.js](https://nodejs.org/en/) (v16+ recommended)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   - Create a `.env` file based on `.env.example` (if available).
   - Set `GEMINI_API_KEY` in `.env.local` if using Gemini API features.

3. **Run the app:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🛠️ Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Builds the production-ready application to the `dist` folder.
- `npm run preview`: Previews the production build locally.

## 📦 Deployment

This repository is configured with **GitHub Actions** to automatically deploy to **GitHub Pages**.

1. **Push changes** to the `main` (or `master`) branch.
2. The `Deploy to GitHub Pages` workflow will automatically run.
3. Once completed, your site will be live at `https://<your-username>.github.io/<repo-name>/`.
   *(Note: You may need to enable GitHub Pages in the repository settings: Settings > Pages > Source = gh-pages branch)*

## 📂 Project Structure

- `src/`: Source code including Components and App logic.
- `public/`: Static assets.
- `.github/workflows/`: CI/CD configurations.
