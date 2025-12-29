# 🔐 Security Fix: JWT-Based Authentication Migration Guide

## ⚠️ **CRITICAL SECURITY ISSUE FIXED**

The previous implementation stored plain user IDs in cookies that could be easily manipulated by anyone. This has been replaced with secure JWT (JSON Web Token) authentication.

## 🛡️ What Was Changed

### 1. **JWT Token Generation** ([src/lib/jwt.ts](src/lib/jwt.ts))
- Tokens are cryptographically signed
- Cannot be modified without invalidating the signature
- Expire after 7 days automatically
- Include user ID, contact, and role

### 2. **Secure Cookie Settings** ([src/action/user/login.ts](src/action/user/login.ts))
- `httpOnly: true` - Cannot be accessed via JavaScript (XSS protection)
- `secure: true` - Only transmitted over HTTPS in production
- `sameSite: 'strict'` - CSRF attack protection
- Token name changed from `"id"` to `"auth_token"`

### 3. **Server-Side Authentication** ([src/lib/auth.ts](src/lib/auth.ts))
New secure functions:
- `getCurrentUser()` - Get full user object from JWT
- `getCurrentUserId()` - Get user ID from JWT
- `requireAuth()` - Enforce authentication
- `logout()` - Clear authentication

### 4. **Server Actions** ([src/action/auth/getuserid.ts](src/action/auth/getuserid.ts))
- `getAuthenticatedUserId()` - Safe way to get user ID from client components
- `requireAuthUserId()` - Get user ID with authentication requirement

## 📝 How to Update Your Code

### ❌ OLD (INSECURE) Pattern:
```tsx
"use client";
import { getCookie } from "cookies-next";

const MyPage = () => {
  const userid: number = parseInt(getCookie("id") ?? "0");
  // ... use userid
}
```

### ✅ NEW (SECURE) Pattern:
```tsx
"use client";
import { getAuthenticatedUserId } from "@/action/auth/getuserid";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MyPage = () => {
  const [userid, setUserid] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      // Get authenticated user ID from server
      const authResponse = await getAuthenticatedUserId();
      if (!authResponse.status) {
        toast.error(authResponse.message);
        router.push("/login");
        return;
      }
      
      const authenticatedUserId = authResponse.data;
      setUserid(authenticatedUserId);
      
      // ... rest of your logic using authenticatedUserId
    };
    
    init();
  }, [router]);

  // ... rest of component
}
```

## 🔄 Files That Need Updating

All files using `getCookie("id")` need to be updated:

### Client Components (use `getAuthenticatedUserId`):
- [ ] `src/app/dashboard/userproperties/page.tsx` ✅ **Example Updated**
- [ ] `src/app/dashboard/userprofile/page.tsx` ✅ **Example Updated**
- [ ] `src/app/dashboard/userrent/page.tsx`
- [ ] `src/app/dashboard/userdailybooking/page.tsx`
- [ ] `src/app/dashboard/userdailybooking/userbooking/page.tsx`
- [ ] `src/app/dashboard/userprofile/edit/page.tsx`
- [ ] `src/app/dashboard/userbidhistory/page.tsx`
- [ ] `src/app/dashboard/userbids/page.tsx`
- [ ] `src/app/dashboard/reports/page.tsx`
- [ ] `src/app/dashboard/shops/**/*.tsx` (multiple files)
- [ ] `src/app/dashboard/rents/**/*.tsx` (multiple files)
- [ ] `src/app/dashboard/properties/**/*.tsx`
- [ ] `src/app/dashboard/page.tsx`
- [ ] `src/app/dashboard/quickpay/page.tsx`
- [ ] `src/app/dashboard/miscinvoice/**/*.tsx`
- [ ] `src/app/dashboard/miscreceipt/**/*.tsx`
- [ ] `src/app/dashboard/dailyshops/**/*.tsx`
- [ ] `src/app/dashboard/layout.tsx`

### Server Components/Actions (use `getCurrentUserId` or `requireAuth`):
If you have server components that need the user ID, import directly:
```tsx
import { getCurrentUserId, requireAuth } from "@/lib/auth";

// In a server component or server action
const userId = await getCurrentUserId();
if (!userId) {
  redirect("/login");
}

// Or use requireAuth to throw error if not authenticated
try {
  const user = await requireAuth();
  const userId = user.id;
} catch (error) {
  redirect("/login");
}
```

## 🔐 Environment Variable (IMPORTANT!)

Add this to your `.env` file:
```env
JWT_SECRET=your-super-secret-key-minimum-32-characters-long-random-string
```

**Generate a secure secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🚀 Testing Checklist

1. [ ] Login works and sets JWT token
2. [ ] All dashboard pages load correctly
3. [ ] User cannot modify cookie to access other accounts
4. [ ] Logout clears the auth token
5. [ ] Token expires after 7 days
6. [ ] Unauthenticated users are redirected to login

## 💡 Additional Security Recommendations

1. **Add Rate Limiting** - Prevent brute force attacks on login
2. **Add HTTPS** - Always use HTTPS in production
3. **Add Token Refresh** - Implement refresh tokens for better UX
4. **Add Session Management** - Track active sessions in database
5. **Add Audit Logging** - Log all authentication events

## 🆘 Need Help?

The pattern is simple:
1. Import `getAuthenticatedUserId` from `@/action/auth/getuserid`
2. Call it in `useEffect` 
3. Check if response.status is false, redirect to login
4. Use the returned user ID

See [src/app/dashboard/userprofile/page.tsx](src/app/dashboard/userprofile/page.tsx) for a complete working example.
