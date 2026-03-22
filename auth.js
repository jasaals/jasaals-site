// auth.js — simple password gate for JASAALS
// Stores auth state in localStorage. Not cryptographically secure,
// but keeps casual visitors out of the site.

const AUTH_KEY = 'jasaals_auth';
const PASSWORD = 'jasaals2024';

/**
 * Call this at the top of every protected page.
 * If the user is not authenticated, they get redirected to login.html immediately.
 */
export function requireAuth() {
    if (localStorage.getItem(AUTH_KEY) !== 'true') {
          // Preserve the page they were trying to reach so we can redirect back after login
      const destination = encodeURIComponent(window.location.href);
          window.location.replace('./login.html?next=' + destination);
    }
}

/**
 * Log the user in. Returns true if the password is correct, false otherwise.
 */
export function login(password) {
    if (password === PASSWORD) {
          localStorage.setItem(AUTH_KEY, 'true');
          return true;
    }
    return false;
}

/**
 * Log the user out and redirect to login.
 */
export function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.replace('./login.html');
}
