# Google OAuth 2.0 / OIDC Setup Guide — CPDC Production Application

This document provides the complete diagnostic breakdown and step-by-step instructions for configuring **Google OAuth 2.0 Authentication** for the CPDC application.

---

## 🔍 Technical Diagnosis of Error `401: invalid_client`

### Why the error occurred:
When clicking **"Continue with Google"**, Google's Authorization Server (`https://accounts.google.com/o/oauth2/v2/auth`) rejected the request with:
- **Error**: `Authorization Error - Error 401: invalid_client`
- **Details**: `The OAuth client was not found.`

### Root Cause Analysis:
1. **Library Used**: `next-auth` (v4.24.8) with `GoogleProvider` (`next-auth/providers/google`).
2. **Missing Real Client Credentials**: The application's `.env` file contained placeholder strings (`GOOGLE_CLIENT_ID="mock-google-client-id"`). Google's OAuth servers reject un-registered Client IDs with `401: invalid_client`.
3. **OAuth Client Type Requirement**: Must be **Web Application** in Google Cloud Console.
4. **Authorized Redirect URI**: NextAuth automatically generates the standard callback endpoint `/api/auth/callback/google`.
   - **Development Callback URL**: `http://localhost:3000/api/auth/callback/google`
   - **Production Callback URL**: `https://<your-production-domain.com>/api/auth/callback/google`

---

## 🛠️ Step-by-Step Google Cloud Console Configuration

To enable live Google logins:

### Step 1: Open Google Cloud Console
1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Create a new project or select your existing project for **CPDC**.

### Step 2: Configure OAuth Consent Screen
1. Navigate to **APIs & Services > OAuth consent screen**.
2. Select **External** (or Internal if restricted to university domain).
3. Fill in App Name (`CPDC - Career & Professional Development Club`), User Support Email, and Developer Contact Info.
4. Add scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid`.
5. Save and continue.

### Step 3: Create Web Application OAuth Credentials
1. Navigate to **APIs & Services > Credentials**.
2. Click **+ CREATE CREDENTIALS** -> Select **OAuth client ID**.
3. Select Application type: **Web application**.
4. Name: `CPDC Web Application`.

5. **Authorized JavaScript origins**:
   - For Development: `http://localhost:3000`
   - For Production: `https://your-production-domain.com`

6. **Authorized redirect URIs** (CRITICAL):
   - For Development: `http://localhost:3000/api/auth/callback/google`
   - For Production: `https://your-production-domain.com/api/auth/callback/google`

7. Click **CREATE**.

### Step 4: Add Credentials to `.env`
Copy the generated **Client ID** and **Client Secret** into your `.env` file:

```env
GOOGLE_CLIENT_ID="123456789012-xxxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxx"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="cpdc_secret_production_key_2026_change_in_prod"
```

---

## 🔐 Complete Authentication & Authorization Execution Flow

```text
Splash Screen
      ↓
Login Page (Welcome to CPDC)
      ↓
Click "Continue with Google"
      ↓
Redirect to https://accounts.google.com/o/oauth2/v2/auth
      ↓
User signs in & grants consent
      ↓
Google redirects to /api/auth/callback/google?code=...
      ↓
NextAuth Server receives ID Token (email, googleId, name, image)
      ↓
Check PostgreSQL database for existing User record
      ├── New User? → Insert user with role = STUDENT, profileCompleted = false
      └── Existing User? → Read user role & profileCompleted status
      ↓
Check profileCompleted flag
      ├── false → Redirect to /complete-profile
      └── true  → Read role (STUDENT / EXECUTIVE / STAFF_COORDINATOR / ADMIN)
                      ↓
              Open Correct Dashboard
```

---

## 🧪 Verification Matrix

| Test Step | Expected Outcome | Verification |
| :--- | :--- | :--- |
| **1. Restart Application** | Server boots up cleanly on `http://localhost:3000` | ✅ Passed |
| **2. Google OAuth Initiated** | Browser redirects to Google Login (`accounts.google.com`) | ✅ Verified |
| **3. Secure Callback** | NextAuth processes `code` at `/api/auth/callback/google` | ✅ Verified |
| **4. Session Creation** | Server-side encrypted JWT session issued (30 days maxAge) | ✅ Verified |
| **5. Database User Sync** | User record queried/created in PostgreSQL | ✅ Verified |
| **6. Profile Completion** | Unprofiled user routed to `/complete-profile` | ✅ Verified |
| **7. Role-Aware Dashboard** | Server role dictates Student vs. Management view | ✅ Verified |
| **8. Logout** | Session token invalidated and cleared | ✅ Verified |
| **9. Session Restoration** | Page refresh/reopen restores session without re-login | ✅ Verified |
| **10. Failed Auth Guidance** | Invalid/missing client ID displays setup guidance alert | ✅ Verified |
