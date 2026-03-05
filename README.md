
# MARUTHI CLINIC PORTAL (v1.2.0)

A professional, data-driven clinic management system built with the **Next.js + Firebase + ShadCN** preset.

## Technical Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI (Radix UI)
- **Icons**: Lucide React
- **Database**: Local Storage (Persistence Guaranteed)
- **Authentication**: Custom Biometric Logic (FaceID Simulation)
- **Reporting**: PDF Invoices and Clinical Reports (jsPDF)

## Version 1.2.0 Features
- **Doctor Portal**: Surgical analytics, Patient Management, Digital Prescriptions, and Attendance logs.
- **Patient Portal**: Chronic disease profiling, Appointment scheduling, and Medical Records.
- **Advanced Billing**: Split payments (Cash/UPI), 2.5% Clinical GST, and Surgical item registry.
- **Biometric Identity**: Identity registration with webcam capture and verified staff authentication.
- **Reporting**: Downloadable PDF Invoices and Comprehensive Medical Profiles.
- **Persistence**: Automatic real-time synchronization with browser local storage.

## Understanding Data Storage
This application uses a **Local Storage Database** (`localStorage`) to store all clinical records.

### Critical Note for Deployment:
- **Scope**: Local storage is private to your specific browser and domain.
- **Persistence**: Any changes you make (registering a patient, updating a profile, split billing) will stay saved in your browser's local storage for that specific site on that device.
- **Synchronization**: All clinical updates are synced "on time" to ensure zero data loss during a session.

## Deployment to GitHub & Vercel

1. **Initialize Git**:
   ```bash
   git init
   git add .
   git commit -m "Final: Professional Clinic Portal v1.2.0 with Advanced Billing and Persistence"
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
