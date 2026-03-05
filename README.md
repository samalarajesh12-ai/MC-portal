# MARUTHI CLINIC PORTAL

A professional, data-driven clinic management system built with the **Next.js + Firebase + ShadCN** preset.

## Technical Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI (Radix UI)
- **Icons**: Lucide React
- **Database**: Local Storage (Current) / Firebase Firestore (Ready)
- **Authentication**: Custom Biometric Logic / Firebase Auth (Ready)

## Understanding Data Storage
This application currently uses a **Local Storage Database** (`localStorage`) to store all clinical records, registrations, and updates. 

### Critical Note for Deployment:
- **Scope**: Local storage is private to your specific browser and domain. 
- **Firebase Studio vs. Vercel**: Data you enter while testing in Firebase Studio **will not** appear in your Vercel deployment. When you open your live Vercel link, the app will initialize its own fresh database for you on that domain.
- **Persistence**: Any changes you make (registering a patient, updating a profile) will stay saved in your browser's local storage for that specific site.

## Deployment to GitHub & Vercel

1. **Initialize Git**:
   ```bash
   git init
   git add .
   git commit -m "Final: Professional Clinic Portal with AI and Analytics"
   ```

2. **Publish to GitHub**:
   - Create a repo at [github.com/new](https://github.com/new).
   - Link and push:
     ```bash
     git remote add origin <YOUR_GITHUB_URL>
     git branch -M main
     git push -u origin main
     ```

3. **Deploy to Vercel**:
   - Go to [Vercel.com](https://vercel.com).
   - Click "Add New" -> "Project".
   - Import your GitHub repo.
   - Click **Deploy**.

## Features
- **Doctor Portal**: Specialized interface for surgical performance analytics and operation registries.
- **Patient Portal**: Focused dashboard for chronic disease profiling and chronological visit tracking.
- **Biometric Identity**: Secure registration with webcam capture or professional portrait upload.
- **Persistence**: Automatic background synchronization with browser storage.
