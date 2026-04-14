# 🚀 Vercel + MongoDB Atlas Connection Guide

This guide will show you how to use the **Programmatic API Keys** you provided to link your Vercel deployment with your MongoDB Atlas cluster. This is the recommended way to solve "502 Bad Gateway" errors caused by connection issues.

## Prerequisites
- **Public Key:** `mjjwzsoq`
- **Private Key:** `********-****-****-ac513808e49c`

---

## Step 1: Add API Keys to MongoDB Atlas Whitelist (Crucial)
Vercel's IP addresses change constantly. Instead of whitelisting thousands of IPs, you should allow access from anywhere **temporarily** to verify the connection.

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Go to **Network Access** (under Security in the left sidebar).
3. Click **Add IP Address**.
4. Click **Allow Access from Anywhere** (adds `0.0.0.0/0`).
5. Click **Confirm**.

---

## Step 2: Set up the Vercel-MongoDB Integration
Using the integration is easier than setting environment variables manually because it handles the linking process for you.

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select your project (**I am HR**).
3. Go to the **Settings** tab.
4. Click on **Integrations** in the left sidebar.
5. Click **Browse Marketplace** and search for **MongoDB Atlas**.
6. Click **Add Integration**.
7. When prompted, use the **Public Key** and **Private Key** you provided to authenticate.
8. Select your Cluster and Database.

---

## Step 3: Manual Verification of Environment Variables
If you prefer to set variables manually, ensure your Vercel project has the following:

| Name | Value |
| :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://anshusaru0740_db_user:<PASSWORD>@cluster0.eaqrvkd.mongodb.net/?appName=Cluster0` |
| `JWT_SECRET` | `supersecretjwtkeythatshouldbechangedinproduction` |

> [!CAUTION]
> Replace `<PASSWORD>` with your actual database user password (different from the API keys).

---

## Step 4: Redploy
Once the variables or integration are set:
1. Go to the **Deployments** tab in Vercel.
2. Click the three dots `...` on your latest deployment.
3. Select **Redeploy** (ensure "Use existing Build Cache" is unchecked if you changed build settings).

---

### Need help finding your DB password?
If you forgot your database user password:
1. Go to **Database Access** in Atlas.
2. Find `anshusaru0740_db_user`.
3. Click **Edit** -> **Edit Password**.
4. Set a new password and update your `MONGODB_URI`.
