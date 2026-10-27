# West Srinivasa Nagar Association – Website

Antigravity IDE → GitHub → Firebase Hosting (frontend) → Google Apps Script + Google Sheets (backend)

## Structure
- `public/` – the website (index.html, css/style.css, js/config.js, js/app.js). Deployed to Firebase Hosting.
- `public/js/config.js` – the only file to edit for settings (`API_URL`, `GOOGLE_CLIENT_ID`, contact details).
- `backend/` – Google Apps Script (`Code.gs`) that reads and writes the Google Sheet and Drive uploads.
- `.github/workflows/` – automatic deploy on every push to `main`, and a preview link for each pull request.
- `firebase.json` – hosting settings and security headers.

## Daily workflow
1. Edit files in Antigravity.
2. Commit and push to GitHub (`git add . && git commit -m "message" && git push`).
3. GitHub Actions deploys the site to Firebase automatically.
4. If you changed `backend/Code.gs`: `cd backend && clasp push`, then Deploy → Manage deployments → New version in Apps Script.

## Never commit
Passwords, service-account keys or `.env` files. The Client ID and `/exec` URL are public by design and are safe to commit. Access is protected by the `Admins` tab in the Sheet.
