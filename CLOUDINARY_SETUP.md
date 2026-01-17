# Cloudinary Setup for Media Files

## Problem
Render's free tier uses **ephemeral storage** - uploaded files are deleted when the service restarts (every ~20 minutes). This means:
- ✅ **Database data persists** (product names, prices, etc. via PostgreSQL)
- ❌ **Media files are lost** (uploaded images stored in `/media/` folder)

## Solution: Cloudinary
Free cloud storage for images with generous limits:
- 25 GB storage
- 25 GB bandwidth/month
- Perfect for product images, workshop photos, etc.

---

## Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com/users/register_free
2. Sign up with your email
3. After login, you'll see your **Dashboard** with credentials

---

## Step 2: Get Your Credentials

From the Cloudinary Dashboard, copy these 3 values:

```
Cloud Name: your_cloud_name
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz123
```

---

## Step 3: Add Environment Variables to Render

1. Go to your Render Dashboard: https://dashboard.render.com/
2. Click on your **Web Service** (basho-project or whatever you named it)
3. Click **Environment** in the left sidebar
4. Click **Add Environment Variable** and add these 3:

```
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = 123456789012345
CLOUDINARY_API_SECRET = abcdefghijklmnopqrstuvwxyz123
```

5. Click **Save Changes**

---

## Step 4: Deploy Changes

The code is already updated! Just commit and push:

```bash
git add .
git commit -m "Add Cloudinary for persistent media storage"
git push origin main
```

Render will automatically redeploy with the new settings.

---

## Step 5: Verify It Works

1. Wait for Render to finish deploying (~5 minutes)
2. Go to your admin panel: https://your-app.onrender.com/admin
3. Upload a product image
4. **Wait 30 minutes** (or restart the service manually)
5. Reload the page - **image should still be there!**

---

## How to Check Uploaded Files

1. Go to Cloudinary Dashboard: https://console.cloudinary.com/
2. Click **Media Library** in the left sidebar
3. You'll see all uploaded images organized by folder

---

## Re-uploading Existing Images

Since previous images were lost, you'll need to re-upload them:

1. Go to admin panel
2. Edit each product
3. Re-upload the image
4. This time it will save to Cloudinary and persist forever!

---

## Troubleshooting

**Images still disappearing?**
- Check Render environment variables are set correctly
- Make sure you pushed the latest code
- Check Render build logs for errors

**Upload errors?**
- Verify Cloudinary credentials are correct
- Check you haven't exceeded free tier limits (25GB)
- Try re-generating API credentials in Cloudinary

**Want to test locally?**
- Don't set `CLOUDINARY_CLOUD_NAME` in local `.env` file
- It will use local `media/` folder automatically
- Only production (Render) needs Cloudinary

---

## Cost

- **Free tier**: 25 GB storage + 25 GB bandwidth/month
- **Paid tier**: If you need more, starts at $0.0004 per GB
- For a small e-commerce site, free tier should be plenty!
