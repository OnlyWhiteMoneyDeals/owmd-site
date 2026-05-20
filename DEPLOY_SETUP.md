# Cloudflare Pages — Preview Deployment Setup

## What This Does

This GitHub Actions workflow gives your OWMD site a **test/preview URL system**:

| Trigger | What Happens |
|---------|-------------|
| Push to `main` | Deploys to **production** (`owmd-site.pages.dev`) |
| Open a Pull Request | Deploys a **unique preview URL** + posts it as a PR comment |
| Manual trigger | Deploy on demand from GitHub Actions tab |

---

## One-Time Setup (5 minutes)

### Step 1: Create the Cloudflare Pages Project

1. Go to [Cloudflare Dashboard → Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
2. Click **Create application** → **Pages** → **Connect to Git**
3. Authorize GitHub and select **`owmd-site`** repository
4. Set:
   - **Project name:** `owmd-site`
   - **Production branch:** `main`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` or `.`
5. Click **Save and Deploy**

> After first deploy your site will be live at: **`https://owmd-site.pages.dev`**

---

### Step 2: Add GitHub Secrets

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these two secrets:

| Secret Name | Value | Where to find it |
|-------------|-------|-----------------|
| `CLOUDFLARE_API_TOKEN` | Your CF API token | [Cloudflare Dashboard → My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens) → Create token → **Edit Cloudflare Pages** template |
| `CLOUDFLARE_ACCOUNT_ID` | `1752bebe4a064ee073589b32ab7b41a0` | Already known ✅ |

**For the API Token**, use the **"Edit Cloudflare Pages"** template which gives the right permissions.

---

### Step 3: Push This Workflow File

```bash
git add .github/workflows/cloudflare-pages.yml
git commit -m "chore: add Cloudflare Pages preview deployment workflow"
git push origin main
```

---

## How to Use Preview Deployments (Your Daily Workflow)

```
1. Create a new branch:     git checkout -b feature/my-changes
2. Make your changes
3. Push the branch:         git push origin feature/my-changes
4. Open a Pull Request on GitHub
5. GitHub Actions runs → posts a preview URL comment on the PR
6. Review the preview URL (e.g. https://abc123.owmd-site.pages.dev)
7. ✅ Approve? → Merge the PR → changes go live on production
8. ❌ Not ready? → Keep pushing commits, preview URL updates automatically
```

---

## Preview URL Format

- **Production:** `https://owmd-site.pages.dev`
- **Branch preview:** `https://<branch-name>.owmd-site.pages.dev`
- **Commit preview:** `https://<hash>.owmd-site.pages.dev`

---

## Account Details

- **Cloudflare Account:** `Onlywhitemoneydeals@gmail.com`
- **Account ID:** `1752bebe4a064ee073589b32ab7b41a0`
- **GitHub Repo:** `https://github.com/OnlyWhiteMoneyDeals/owmd-site`
