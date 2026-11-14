/* Game Master's Keep · Phase 4.1 authentication entry
   Neon Managed Better Auth. This file contains no database/admin secrets. */
const NEON_AUTH_URL = 'https://ep-ancient-hat-bdv9eakf.neonauth.c-8.us-east-2.aws.neon.tech/neondb/auth';

const $auth = (id) => document.getElementById(id);
let authClient;
let authMode = 'signin';

function authMessage(message, kind = 'info') {
  const box = $auth('authMessage');
  if (!box) return;
  box.textContent = message;
  box.dataset.kind = kind;
  box.hidden = !message;
}

function showAuthMode(mode) {
  authMode = mode;
  const signup = mode === 'signup';
  $auth('authNameField').hidden = !signup;
  $auth('authSubmit').textContent = signup ? 'Create account' : 'Sign in';
  $auth('authModeTitle').textContent = signup ? 'Create your account' : 'Welcome back';
  $auth('authModeCopy').textContent = signup
    ? 'Register with your email address. Email verification is required.'
    : 'Sign in with the email address and password associated with your account.';
  $auth('authSwitchText').textContent = signup ? 'Already have an account?' : 'New to the Keep?';
  $auth('authSwitch').textContent = signup ? 'Sign in' : 'Create an account';
  $auth('authName').required = signup;
  authMessage('');
}

function unlockForSignedInUser(user) {
  document.body.classList.add('gmk-authenticated');
  $auth('authGate').hidden = true;
  const label = user?.name || user?.email || 'Signed in';
  const badge = $auth('accountIdentity');
  if (badge) badge.textContent = label;
  const status = $auth('accountStatus');
  if (status) status.textContent = 'ACCOUNT CONNECTED';
  document.dispatchEvent(new CustomEvent('gmk:authenticated', { detail: { user } }));
}

function lockForSignedOutUser() {
  document.body.classList.remove('gmk-authenticated');
  $auth('authGate').hidden = false;
  const status = $auth('accountStatus');
  if (status) status.textContent = 'SIGN IN REQUIRED';
}

async function initializeAuth() {
  try {
    const { createAuthClient } = await import('https://esm.sh/@neondatabase/auth@latest');
    authClient = createAuthClient(NEON_AUTH_URL);
    const result = await authClient.getSession();
    if (result?.error) throw result.error;
    const session = result?.data?.session || result?.data;
    const user = session?.user || result?.data?.user;
    if (user) unlockForSignedInUser(user);
    else lockForSignedOutUser();
    $auth('authConnectionNote').textContent = 'Connected to the Game Master’s Keep development authentication service.';
  } catch (error) {
    lockForSignedOutUser();
    $auth('authConnectionNote').textContent = 'The authentication service could not be reached. Check your connection and try again.';
    authMessage(error?.message || 'Could not initialize the authentication service.', 'error');
  }
}

$auth('authSwitch')?.addEventListener('click', () => showAuthMode(authMode === 'signin' ? 'signup' : 'signin'));
$auth('authForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!authClient) {
    authMessage('The authentication service is not ready yet. Refresh the page and try again.', 'error');
    return;
  }
  const button = $auth('authSubmit');
  button.disabled = true;
  button.textContent = authMode === 'signup' ? 'Creating account…' : 'Signing in…';
  authMessage('');
  try {
    const email = $auth('authEmail').value.trim();
    const password = $auth('authPassword').value;
    const result = authMode === 'signup'
      ? await authClient.signUp.email({ name: $auth('authName').value.trim(), email, password })
      : await authClient.signIn.email({ email, password });
    if (result?.error) throw result.error;
    const sessionResult = await authClient.getSession();
    if (sessionResult?.error) throw sessionResult.error;
    const session = sessionResult?.data?.session || sessionResult?.data;
    const user = session?.user || sessionResult?.data?.user || result?.data?.user;
    if (user && session) {
      unlockForSignedInUser(user);
      authMessage(authMode === 'signup' ? 'Account created and signed in.' : 'You are signed in.', 'success');
    } else if (authMode === 'signup') {
      showAuthMode('signin');
      $auth('authEmail').value = email;
      authMessage('Your registration was submitted. Check your email and complete the verification step Neon sends you. Then return here to sign in. Your campaign workspace will remain locked until sign-in succeeds.', 'success');
    } else {
      authMessage('Sign-in completed, but no active session was returned. Please try again.', 'error');
    }
  } catch (error) {
    authMessage(error?.message || 'Authentication failed. Please check your details and try again.', 'error');
  } finally {
    button.disabled = false;
    button.textContent = authMode === 'signup' ? 'Create account' : 'Sign in';
  }
});

$auth('signOutButton')?.addEventListener('click', async () => {
  if (!authClient) return;
  try {
    await authClient.signOut();
    lockForSignedOutUser();
    showAuthMode('signin');
    authMessage('You have been signed out.', 'success');
  } catch (error) {
    toast(error?.message || 'Could not sign out.');
  }
});

showAuthMode('signin');
initializeAuth();
