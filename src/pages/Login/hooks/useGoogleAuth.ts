// src/pages/Login/hooks/useGoogleAuth.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { useAppDispatch } from 'src/redux/hooks';
import { setLoader } from 'src/services';
import { ENotify } from '@ai-dashboard/ui';
import { dashApiInstance } from 'src/services/instance';

declare global { interface Window { google?: any } }

type Options = {
  clientId: string;              // REQUIRED: Google Web OAuth client ID
  buttonContainerId?: string;    // default: 'g_id_signin'
  adminLoginEndpoint?: string;   // default: '/admin/login/'
  emailSignInEndpoint?: string;  // default: '/emailregisteration/email-signin/'
};

// Minimal decoder to read email from Google ID token
const decodeJwt = (token?: string): any => {
  if (!token) return null;
  try {
    const b64 = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
    if (!b64) return null;
    const json = decodeURIComponent(
      atob(b64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch { return null; }
};

const useGoogleAuth = (handleConnect: () => void, opts: Options) => {
  const dispatch = useAppDispatch();
  const inited = useRef(false);

  const clientId = opts.clientId;
  const buttonContainerId = opts.buttonContainerId ?? 'g_id_signin';
  const ADMIN_LOGIN = opts.adminLoginEndpoint ?? '/admin/login/';
  const EMAIL_SIGNIN = opts.emailSignInEndpoint ?? '/emailregisteration/email-signin/';

  useEffect(() => {
    if (inited.current) return;

    const ensureScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.google?.accounts?.id) return resolve();
        const s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true; s.defer = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load Google script'));
        document.head.appendChild(s);
      });

    const persistAndProceed = async (data: any, email: string) => {
      // Expected data from /admin/login/: { access_token, user_id, username, roles, permissions, db_access, ... }
      if (data?.access_token) localStorage.setItem('authToken', data.access_token);

      const userPayload = {
        user_id: data?.user_id,
        username: data?.username ?? (email?.split('@')[0] || 'Anonymous User'),
        email,
        roles: data?.roles ?? [],
        permissions: data?.permissions ?? [],
        db_access: data?.db_access ?? [],
        provider: 'google',
      };
      localStorage.setItem('userInfo', JSON.stringify(userPayload));

      // Notify the app shell and proceed
      try { window.dispatchEvent(new Event('storage')); } catch {}
      ENotify('success', `Welcome ${userPayload.username}!`);
      try { handleConnect(); } catch {}

      // Hard fallback if route didn’t change
      setTimeout(() => {
        const onLogin = new Set(['', '/', '/login', '/signin']);
        if (onLogin.has(window.location.pathname)) {
          window.location.replace('/dashboard'); // change to your real post-login route if needed
        }
      }, 0);
    };

    const init = async () => {
      try {
        await ensureScript();
        if (!clientId || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (resp: any) => {
            const credential = resp?.credential;
            if (!credential) {
              ENotify('warning', 'No Google credential received.');
              return;
            }

            const claims = decodeJwt(credential);
            const gEmail = (claims?.email as string | undefined)?.trim();
            if (!gEmail) {
              ENotify('warning', 'Google did not return an email.');
              return;
            }

            dispatch(setLoader(true));
            try {
              // STEP 1: call email registration endpoint FIRST with source='google'
              await dashApiInstance.post(
                EMAIL_SIGNIN,
                { email: gEmail, source: 'google' },
                { headers: { Authorization: '' } } // public route
              );

              // STEP 2: on success, call /admin/login/ with username=email
              const loginRes = await dashApiInstance.post(
                ADMIN_LOGIN,
                { username: gEmail },
                { headers: { Authorization: '' } }
              );

              await persistAndProceed(loginRes.data, gEmail);
              return;
            } catch (err: any) {
              const detail = err?.response?.data?.detail || err?.message || 'Google sign-in failed.';
              ENotify('warning', detail);
            } finally {
              dispatch(setLoader(false));
            }
          },
          auto_select: false,
          context: 'signin',
        });

        const el = document.getElementById(buttonContainerId);
        if (el) {
          window.google.accounts.id.renderButton(el, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            width: 300,
          });
        }
        inited.current = true;
      } catch {
        ENotify('warning', 'Unable to initialize Google Sign-In (script blocked?).');
      }
    };

    init();
  }, [clientId, buttonContainerId, handleConnect, ADMIN_LOGIN, EMAIL_SIGNIN]);

  return {};
};

export default useGoogleAuth;
