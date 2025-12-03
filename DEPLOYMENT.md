# Deployment Guide

This app has been configured to deploy to Vercel for easy access on mobile devices.

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Website (Recommended)

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up or log in with your GitHub account
3. Click "Add New Project"
4. Import your repository: `TagorPetrosian/share-lib`
5. Vercel will auto-detect the settings (already configured in `vercel.json`)
6. Click "Deploy"
7. Wait for deployment to complete (usually 1-2 minutes)
8. Your app will be live at a URL like: `https://share-lib-xxx.vercel.app`

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. Follow the prompts to link your project

5. For production deployment:
   ```bash
   vercel --prod
   ```

## Important Notes

- **HTTPS Required**: Vercel automatically provides HTTPS, which is required for the Web Share API to work on mobile devices
- **Auto-deployments**: Once connected, Vercel will automatically deploy every push to your GitHub repository
- **Custom Domain**: You can add a custom domain in the Vercel dashboard after deployment

## Testing on Mobile

After deployment:
1. Open the Vercel URL on your phone
2. The Web Share API will work properly with HTTPS
3. You can share the PDF file using the native share dialog

