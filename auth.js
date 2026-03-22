// auth.js — Clerk-based auth for JASAALS
// Uses Clerk Frontend API directly via fetch (no SDK dependency).
// The publishable key is safe to expose in frontend code.

export const CLERK_PUBLISHABLE_KEY = 'pk_live_Y2xlcmsuamFzYWFscy5jb20k';
export const CLERK_FRONTEND_API = 'https://clerk.jasaals.com';

// Emails allowed to access the site (enforced client-side as a UX gate)
export const ALLOWED_EMAILS = [
  'jeffreyspears@pm.me',
  'annaleahspears@proton.me',
];

// --- Session helpers ---

function getStoredSession() {
  try { return JSON.parse(sessionStorage.getItem('__jasaals_session') || 'null'); }
  catch { return null; }
}

function storeSession(data) {
  sessionStorage.setItem('__jasaals_session', JSON.stringify(data));
}

function clearSession() {
  sessionStorage.removeItem('__jasaals_session');
}

// Verify the stored session is still valid by calling Clerk's /v1/client endpoint
async function verifySession(clientToken) {
  try {
    const res = await fetch(`${CLERK_FRONTEND_API}/v1/client`, {
      headers: {
        'Authorization': `Bearer ${clientToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json();
    // Check if there's at least one active session
    const activeSessions = data?.response?.sessions?.filter(s => s.status === 'active');
    return activeSessions && activeSessions.length > 0;
  } catch {
    return false;
  }
}

/**
 * Call this at the top of every protected page.
 * Redirects to login.html if the user has no valid session.
 */
export async function requireAuth() {
  try {
    const session = getStoredSession();
    if (!session?.token) {
      redirect();
      return;
    }
    const valid = await verifySession(session.token);
    if (!valid) {
      clearSession();
      redirect();
    }
  } catch {
    redirect();
  }
}

function redirect() {
  const destination = encodeURIComponent(window.location.href);
  window.location.replace('./login.html?next=' + destination);
}

/**
 * Sign out and redirect to login.
 */
export async function logout() {
  const session = getStoredSession();
  if (session?.token && session?.sessionId) {
    try {
      await fetch(`${CLERK_FRONTEND_API}/v1/client/sessions/${session.sessionId}/revoke`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.token}` },
        credentials: 'include',
      });
    } catch {}
  }
  clearSession();
  window.location.replace('./login.html');
}
