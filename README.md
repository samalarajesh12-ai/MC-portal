# MARUTHI CLINIC PORTAL

This is a Next.js-based patient and doctor portal for Maruthi Clinic, built using Firebase Studio.

## Project Abstract

### EXISTING SYSTEM

The initial version of the Maruthi Clinic Portal was a frontend-only prototype with a user interface built using Next.js and ShadCN components. The system featured several pages for patient interactions, such as viewing appointments, medications, and messages. However, all data was static and hardcoded within the application's source code. There was no backend database, user authentication, or persistent data storage, meaning any changes made by the user were not saved. The system served as a visual and structural foundation but lacked the functionality required for a real-world application.

### PROPOSED SYSTEM

The proposed system transforms the prototype into a dynamic, full-stack web application by integrating a robust Firebase backend. This enhancement introduces secure, persistent data storage and real-time capabilities. Key features of the proposed system include:

*   **Secure Authentication:** Patients and doctors can create accounts and log in securely using either traditional email and password credentials or a modern Face ID verification system.
*   **Comprehensive Registration:** Expanded registration forms for both patients and doctors capture essential information, including personal details, medical history, professional qualifications, and face images for biometric authentication.
*   **Firestore Database:** All application data, including patient profiles, doctor information, appointments, medication requests, and messages, is securely stored and managed in a NoSQL Firestore database.
*   **Role-Based Portals:** The application provides distinct portals for patients, doctors, and administrators, each with a tailored user interface and functionality.
*   **Core Features:**
    *   **Patient Portal:** Allows patients to schedule appointments with specialized doctors, view medical bills and download them as PDFs, manage medication refills, and communicate with their healthcare providers.
    *   **Doctor Portal:** Enables doctors to manage their patient information, appointments, and professional details.
*   **Data Security:** Firebase Security Rules are implemented to enforce strict data privacy, ensuring that users can only access their own information.

### SOFTWARE REQUIREMENTS

*   **Operating System:** Windows, macOS, or Linux
*   **Web Browser:** Google Chrome, Firefox, Safari, or Microsoft Edge (latest versions)
*   **Frontend Framework:** Next.js with React & TypeScript
*   **Styling:** Tailwind CSS with ShadCN UI components
*   **Backend-as-a-Service:** Google Firebase (including Firestore and Firebase Authentication)
*   **Development Environment:** Node.js (v18 or later), npm/yarn
*   **Code Editor:** Visual Studio Code or any other modern editor

### HARDWARE REQUIREMENTS

*   **Processor:** Multi-core processor (e.g., Intel Core i5, AMD Ryzen 5, or equivalent)
*   **RAM:** Minimum 8 GB (16 GB recommended for smoother development)
*   **Storage:** Minimum 20 GB of free disk space (SSD recommended)
*   **Peripherals:** Webcam (required for Face ID login and registration)
*   **Network:** A stable internet connection for accessing Firebase services
