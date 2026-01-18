# Getting DATABASE_URL from Render (Free Tier)

## Overview
Even on the free tier, you can have **one PostgreSQL database** in addition to your web service.

## Step-by-Step Instructions

### 1. Create PostgreSQL Database (if not already created)

1. Go to https://dashboard.render.com/
2. Click **"New +"** button (top right)
3. Select **"PostgreSQL"**
4. Fill in the form:
   - **Name**: `basho-database` (or any name you prefer)
   - **Database**: `basho_db` (or leave default)
   - **User**: `basho_user` (or leave default)
   - **Region**: Choose same region as your web service
   - **PostgreSQL Version**: 16 (latest)
   - **Instance Type**: **Free** (select this!)
5. Click **"Create Database"**

### 2. Get the DATABASE_URL

After creating the database:

1. Go to your PostgreSQL database dashboard
2. Scroll down to the **"Connections"** section
3. You'll see **"Internal Database URL"** and **"External Database URL"**
4. **Copy the "Internal Database URL"** (looks like this):
   ```
   postgresql://user:password@hostname/database_name
   ```

### 3. Add DATABASE_URL to Your Web Service

1. Go to your **Web Service** dashboard (not the database)
2. Click on **"Environment"** tab (left sidebar)
3. Click **"Add Environment Variable"**
4. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the Internal Database URL you copied
5. Click **"Save Changes"**
6. Wait for automatic redeploy (3-5 minutes)

## Important Notes

### Free Tier Limits
- ✓ You can have 1 free PostgreSQL database
- ✓ You can have 1 free web service
- ✓ Database expires after **90 days** of inactivity (just redeploy to keep it active)
- Database size limit: **1 GB**

### Internal vs External URL
- **Internal Database URL**: Use this! Faster, free bandwidth
- **External Database URL**: Only for connecting from outside Render (like from your local machine)

### If Database Already Exists
If you already created a PostgreSQL database:
1. Go to https://dashboard.render.com/
2. Click on your PostgreSQL database
3. Find the **"Internal Database URL"** in the Connections section
4. Copy it and add to your web service environment variables

## Verify It's Working

After adding DATABASE_URL and redeploying:

1. Check your logs (Render Dashboard → Logs)
2. Look for successful database connection messages
3. Admin panel changes should now persist!

## Troubleshooting

### "Can't find database URL"
- Make sure you created a PostgreSQL database (not just web service)
- Database creation is separate from web service creation

### "Already have a database but don't know the URL"
- Go to Render Dashboard
- Click on the PostgreSQL database (not web service)
- Scroll to "Connections" section
- Copy "Internal Database URL"

### "Database connection failed"
- Verify you copied the **Internal** URL (not External)
- Check that both database and web service are in the same region
- Ensure database status is "Available" (green checkmark)

---

**Quick Checklist:**
- [ ] PostgreSQL database created on Render
- [ ] Internal Database URL copied
- [ ] DATABASE_URL added to web service environment
- [ ] Service redeployed
- [ ] Logs show successful database connection
