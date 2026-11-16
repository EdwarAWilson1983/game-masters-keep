/* Game Master's Keep · Phase 4.1 authentication entry
   Neon Managed Better Auth. This file contains no database/admin secrets. */
const NEON_AUTH_URL = 'https://ep-ancient-hat-bdv9eakf.neonauth.c-8.us-east-2.aws.neon.tech/neondb/auth';

const $auth = (id) => document.getElementById(id);
let authClient;
let authMode = 'signin';
let pendingVerificationEmail = '';

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
  $auth('authForm').hidden = false;
  $auth('authVerifyForm').hidden = true;
  $auth('authSwitchRow').hidden = false;
  $auth('authVerifyAccessRow').hidden = signup;
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

function showVerificationMode(email) {
  authMode = 'verify';
  pendingVerificationEmail = email;
  $auth('authForm').hidden = true;
  $auth('authVerifyForm').hidden = false;
  $auth('authSwitchRow').hidden = true;
  $auth('authVerifyAccessRow').hidden = true;
  $auth('authModeTitle').textContent = 'Verify your email';
  $auth('authModeCopy').textContent = 'Enter the six-digit code sent to your email address. The code expires after a short time.';
  $auth('authVerifyEmail').value = email;
  $auth('authOtp').value = '';
  authMessage('A verification code was sent to your email.');
  $auth('authOtp').focus();
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

function unwrapError(result) {
  if (result?.error) throw result.error;
  return result?.data ?? result;
}

async function refreshSession() {
  const result = unwrapError(await authClient.getSession());
  const session = result?.session || result;
  const user = session?.user || result?.user;
  if (user && session) {
    unlockForSignedInUser(user);
    return true;
  }
  return false;
}

async function initializeAuth() {
  try {
    const { createAuthClient } = await import('https://esm.sh/@neondatabase/auth@latest');
    authClient = createAuthClient(NEON_AUTH_URL);
    await refreshSession();
    if (!document.body.classList.contains('gmk-authenticated')) lockForSignedOutUser();
    $auth('authConnectionNote').textContent = 'Connected to the Game Master’s Keep development authentication service.';
  } catch (error) {
    lockForSignedOutUser();
    $auth('authConnectionNote').textContent = 'The authentication service could not be reached. Check your connection and try again.';
    authMessage(error?.message || 'Could not initialize the authentication service.', 'error');
  }
}

$auth('authSwitch')?.addEventListener('click', () => showAuthMode(authMode === 'signin' ? 'signup' : 'signin'));
$auth('authOpenVerify')?.addEventListener('click', () => {
  const email = $auth('authEmail').value.trim();
  if (!email) {
    authMessage('Enter your email address above first, then choose this option again.', 'error');
    $auth('authEmail').focus();
    return;
  }
  showVerificationMode(email);
});

$auth('authForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!authClient) {
    authMessage('The authentication service is not ready yet. Refresh the page and try again.', 'error');
    return;
  }
  const button = $auth('authSubmit');
  const submittingMode = authMode;
  button.disabled = true;
  button.textContent = submittingMode === 'signup' ? 'Creating account…' : 'Signing in…';
  authMessage('');
  try {
    const email = $auth('authEmail').value.trim();
    const password = $auth('authPassword').value;
    const result = submittingMode === 'signup'
      ? await authClient.signUp.email({ name: $auth('authName').value.trim(), email, password })
      : await authClient.signIn.email({ email, password });
    unwrapError(result);
    if (await refreshSession()) {
      authMessage(submittingMode === 'signup' ? 'Account created and signed in.' : 'You are signed in.', 'success');
    } else if (submittingMode === 'signup') {
      showVerificationMode(email);
    } else {
      authMessage('Your email still needs verification. Enter the code we sent you.', 'error');
      showVerificationMode(email);
    }
  } catch (error) {
    const message = error?.message || 'Authentication failed. Please check your details and try again.';
    if (submittingMode === 'signin' && /email.*(not|isn.t)\s*verified|verification.*required/i.test(message)) {
      showVerificationMode($auth('authEmail').value.trim());
      authMessage('Your account exists, but its email is not verified yet. Enter the six-digit code we sent you.', 'error');
    } else {
      authMessage(message, 'error');
    }
  } finally {
    button.disabled = false;
    button.textContent = authMode === 'signup' ? 'Create account' : 'Sign in';
  }
});

$auth('authVerifyForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!authClient) return authMessage('The authentication service is not ready. Refresh and try again.', 'error');
  const button = $auth('authVerifySubmit');
  const email = pendingVerificationEmail || $auth('authVerifyEmail').value.trim();
  const otp = $auth('authOtp').value.trim();
  if (!/^\d{6}$/.test(otp)) return authMessage('Enter the six-digit code from your email.', 'error');
  button.disabled = true;
  button.textContent = 'Verifying…';
  authMessage('');
  try {
    if (!authClient.emailOtp?.verifyEmail) {
      throw new Error('This authentication client does not expose the email-code verification method. The login interface is ready, but the Neon Auth client configuration needs to be checked.');
    }
    unwrapError(await authClient.emailOtp.verifyEmail({ email, otp }));
    if (await refreshSession()) {
      authMessage('Email verified. You are signed in.', 'success');
    } else {
      showAuthMode('signin');
      $auth('authEmail').value = email;
      $auth('authPassword').focus();
      authMessage('Email verified successfully. Sign in with your password to enter the Keep.', 'success');
    }
  } catch (error) {
    authMessage(error?.message || 'That code could not be verified. Check it and try again.', 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Verify email';
  }
});

$auth('authResendCode')?.addEventListener('click', async () => {
  if (!authClient) return authMessage('The authentication service is not ready. Refresh and try again.', 'error');
  const button = $auth('authResendCode');
  const email = pendingVerificationEmail || $auth('authVerifyEmail').value.trim();
  button.disabled = true;
  button.textContent = 'Sending…';
  try {
    if (!authClient.emailOtp?.sendVerificationOtp) {
      throw new Error('This authentication client does not expose the resend-code method.');
    }
    unwrapError(await authClient.emailOtp.sendVerificationOtp({ email, type: 'email-verification' }));
    authMessage('A new verification code has been requested. Check your inbox.', 'success');
  } catch (error) {
    authMessage(error?.message || 'Could not resend the verification code.', 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Resend verification code';
  }
});

$auth('authBackToSignIn')?.addEventListener('click', () => {
  showAuthMode('signin');
  if (pendingVerificationEmail) $auth('authEmail').value = pendingVerificationEmail;
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

  /* Phase 4.2 preparation: expose a short-lived Neon Auth JWT to trusted app code.
     This does not expose credentials; the token is requested only when needed. */
  window.GMKAuth = Object.freeze({
    async getAccessToken() {
      if (!authClient) {
        throw new Error('Authentication is not ready yet.');
      }

      const result = unwrapError(await authClient.getSession());
      const token = result?.session?.access_token;

      if (typeof token !== 'string' || !token) {
        throw new Error('No signed-in access token is available. Please sign in again.');
      }

      return token;
    }
  });
