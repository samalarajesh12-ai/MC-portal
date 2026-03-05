# MARUTHI CLINIC PORTAL

This is a Next.js-based patient and doctor portal for Maruthi Clinic, built using Firebase Studio.

## Deployment to GitHub

To push your project to GitHub and set up a publishing branch, follow these steps:

1. **Initialize Git**: Open your terminal in the project root and run:
   ```bash
   git init
   ```

2. **Stage and Commit**:
   ```bash
   git add .
   git commit -m "Feature: Professional Patient and Doctor Portals"
   ```

3. **Link to GitHub**:
   - Create a new repository on [GitHub](https://github.com/new).
   - Copy the repository URL (e.g., `https://github.com/your-username/maruthi-clinic-portal.git`).
   - Run:
     ```bash
     git remote add origin <YOUR_GITHUB_REPO_URL>
     ```

4. **Push to Main**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

5. **Publishing with Firebase App Hosting**:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Select your project.
   - Navigate to **App Hosting** in the left sidebar.
   - Click **Get Started** and connect your GitHub repository.
   - Select the branch you want to deploy (e.g., `main`).
   - Follow the wizard to complete the setup. Firebase will automatically build and deploy your app whenever you push to that branch.

---

## Project Features

### Patient Portal
- **Dashboard**: Professional health overview with blood group and emergency contact visibility.
- **Appointments**: Sequential, chronological view of upcoming clinical visits.
- **Medications**: Integrated refill request system with automated notifications.
- **Health Records**: Access to medical history and lab results.
- **Billing**: Medical billing history in Rupees (Rs).

### Doctor Portal
- **Performance Dashboard**: Professional metrics including surgical success rates and patient volume.
- **Operations Registry**: Detailed historical log of all clinical operations.
- **Attendance**: Daily shift and work hour tracking.
- **Specialized Onboarding**: Comprehensive registration with 20+ medical specialties and biometric verification (webcam or file upload).

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & ShadCN UI
- **Backend**: Firebase (Firestore, Auth, App Hosting)
- **Icons**: Lucide React
