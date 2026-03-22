// auth.js — Clerk-based auth for JASAALS
// Uses Clerk's vanilla JS SDK (loaded via CDN) for email OTP authentication.
// The publishable key is safe to expose in frontend code.

export const CLERK_PUBLISHABLE_KEY = 'pk_live_Y2xlcmsuamFzYWFscy5jb20k';

// Emails allowed to access the site (enforced client-side as a UX gate)
export const ALLOWED_EMAILS = [
  'jeffreyspears@pm.me',
  'annaleahspears@proton.me',
];

/**
 * Load the Clerk SDK and return the Clerk instance.
 * Caches the instance on window so it's only initialised once.
 */
export async function getClerk() {
  if (window.__clerk_instance) return window.__clerk_instance;

  // Load Clerk's browser SDK from CDN — pinned to v5 for stability
  if (!window.Clerk) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const clerk = new window.Clerk(CLERK_PUBLISHABLE_KEY);
  await clerk.load();
  window.__clerk_instance = clerk;
  return clerk;
}

/**
 * Call this at the top of every protected page.
 * Redirects to login.html if the user has no active Clerk session.
 * If Clerk fails to load for any reason, redirects to login as a safe fallback.
 */
export async function requireAuth() {
  try {
    const clerk = await getClerk();
    if (!clerk.user) {
      const destination = encodeURIComponent(window.location.href);
      window.location.replace('./login.html?next=' + destination);
    }
  } catch (err) {
    // If auth check fails for any reason, send to login (fail-safe)
    console.error('Auth check failed, redirecting to login:', err);
    window.location.replace('./login.html');
  }
}

/**
 * Sign out and redirect to login.
 */
export async function logout() {
  try {
    const clerk = await getClerk();
    await clerk.signOut();
  } catch (e) {}
  window.location.replace('./login.html');
}
