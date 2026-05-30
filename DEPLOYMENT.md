# 🚀 Deployment Guide - Cricket 3D PRO

## Upload to GitHub & Deploy on Vercel (No CMD Needed!)

### Method 1: GitHub Website Upload (Easiest)

#### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `cricket-3d-pro`
3. **Description**: `🏏 3D Cricket Game with real 2026 players`
4. **Public** ✓
5. Click "Create repository"

#### Step 2: Upload Files

**Upload these files to your GitHub repository:**

```
✅ src/App.tsx
✅ src/index.css
✅ src/main.tsx
✅ src/utils/cn.ts
✅ index.html
✅ package.json
✅ package-lock.json
✅ tsconfig.json
✅ vite.config.ts
✅ README.md
```

**How to upload:**
1. Click "uploading an existing file" on GitHub
2. Drag and drop the `src` folder
3. Commit with message: "Add src folder"
4. Repeat for root files (index.html, package.json, etc.)

**OR upload in bulk:**
1. Click "Add file" → "Upload files"
2. Drag all files except `node_modules` and `dist`
3. Commit changes

#### Step 3: Deploy on Vercel

1. Go to https://vercel.com
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel
4. Click "New Project"
5. Find "cricket-3d-pro" → Click "Import"
6. **Settings auto-detected:**
   - Framework: Vite ✓
   - Build Command: `npm run build` ✓
   - Output Directory: `dist` ✓
7. Click **"Deploy"**
8. Wait 2 minutes ⏳
9. **DONE!** 🎉

Your game is live at:
```
https://cricket-3d-pro.vercel.app
```

---

## Method 2: Quick Deploy (Pre-built)

If you already ran `npm run build`:

1. **Upload only `dist/index.html`** to:
   - Netlify Drop: https://app.netlify.com/drop
   - GitHub Pages
   - Any static host

2. **Done!** Single HTML file works anywhere.

---

## Method 3: Git Command Line (Advanced)

```bash
# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Cricket 3D Pro - Phase 1 Complete"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/cricket-3d-pro.git

# Push
git branch -M main
git push -u origin main

# Then deploy on Vercel (as in Method 1, Step 3)
```

---

## 📱 Device Compatibility

### ✅ Desktop
- Windows PC (Chrome, Edge, Firefox)
- Mac (Safari, Chrome, Firefox)
- Linux (Chrome, Firefox)

### ✅ Mobile (Limited — landscape orientation required)
- iPhone 11+ (Safari, Chrome)
- iPad (Safari, Chrome)
- Android tablets (Chrome, Samsung Browser)
- Android phones 2020+ (landscape mode)

### ⚠️ Not Optimized For:
- Portrait mode (game is landscape 16:9)
- Very old browsers (no WebGL)
- Devices without WebGL support

---

## 🎮 How to Share Your Game

### 1. Direct Link
```
https://cricket-3d-pro.vercel.app
```

### 2. QR Code
Generate at: https://qr-code-generator.com  
Enter your Vercel URL

### 3. Embed in Website
```html
<iframe 
  src="https://cricket-3d-pro.vercel.app" 
  width="100%" 
  height="800px" 
  style="border: none;">
</iframe>
```

### 4. Social Media
```
🏏 Play Cricket 3D PRO!
✨ 3D coin toss animation
⚾ Real 2026 players
🎮 India vs Australia vs England

Play now: https://cricket-3d-pro.vercel.app

#Cricket #Gaming #ThreeJS #WebGL
```

---

## 🔧 Troubleshooting

### Build fails on Vercel?
**Solution**: Check Node version in `package.json`:
```json
{
  "engines": {
    "node": "18.x"
  }
}
```

### Can't find repository on Vercel?
**Solution**:
1. Go to Vercel → Settings → Git Integrations
2. Configure GitHub → Adjust repository access
3. Grant access to your repo

### Game doesn't load?
**Solution**:
1. Check browser console (F12)
2. Ensure WebGL is enabled
3. Try different browser
4. Clear cache

### Performance issues?
**Solution**:
1. Close other tabs
2. Disable browser extensions
3. Try Chrome/Edge (best performance)

---

## 🌟 Custom Domain (Optional)

### Add Your Own Domain

1. Buy domain (e.g., `cricket3d.com`)
2. Go to Vercel → Your Project → Settings → Domains
3. Add domain → Follow DNS instructions
4. Wait 5-10 minutes for DNS propagation
5. Your game is now at `cricket3d.com`!

---

## 📊 Analytics (Optional)

Add Vercel Analytics:
1. Go to Project → Analytics
2. Enable Web Analytics
3. See visitors, pageviews, performance

---

## 🎯 Quick Checklist

```
□ GitHub repository created
□ All files uploaded (src/, index.html, package.json, etc.)
□ Vercel account connected to GitHub
□ Project imported on Vercel
□ Build successful
□ Game tested on live URL
□ Link shared with friends
```

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Docs**: https://docs.github.com
- **Vite Docs**: https://vitejs.dev

---

**Your game is ready to share with the world!** 🏏🎉

Deploy once, works everywhere! ✨
