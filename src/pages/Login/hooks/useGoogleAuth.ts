// src/pages/Login/hooks/useGoogleAuth.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { useAppDispatch } from 'src/redux/hooks';
import { ENotify } from '@ai-dashboard/ui';
import { dashApiInstance } from 'src/services/instance';
import { setLoader, handleUserActions } from 'src/services';

// 🔧 adjust these import paths to your actual slice
import { setUserInfo, setConnectWith } from 'src/redux/dashboardServices';

declare global { interface Window { google?: any } }

type Options = {
  clientId: string;
  buttonContainerId?: string;
  adminLoginEndpoint?: string;   // '/admin/login/'
  emailSignInEndpoint?: string;  // '/emailregisteration/email-signin/'
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

  // After login: push to Redux, select default DB, and hit ext0003 + dhb0003
  const postLoginBootstrap = async (data: any, email: string) => {
    // 1) persist token (optional) + axios auth header
    if (data?.access_token) {
      localStorage.setItem('authToken', data.access_token);
      dashApiInstance.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
    }

    // 2) normalize user
    const appUser = {
      user_id: data?.user_id,
      username: data?.username ?? (email?.split('@')[0] || 'Anonymous User'),
      email,
      roles: data?.roles ?? [],
      permissions: data?.permissions ?? [],
      db_access: data?.db_access ?? [],
      access_token: data?.access_token ?? null,
      provider: 'google',
    };

    // 3) keep for refresh (optional)
    localStorage.setItem('userInfo', JSON.stringify(appUser));

    // 4) choose default DB
    const defaultDb =
      appUser.db_access.find((d: any) => d?.default_db) ||
      appUser.db_access[0] ||
      null;

    // 5) update Redux
    dispatch(setUserInfo(appUser));
    if (defaultDb) dispatch(setConnectWith(defaultDb));

    // 6) immediately call bootstrap actions
    if (appUser.user_id) {
      try {
        await handleUserActions({ Action: 'ext0003', Data: { user_id: appUser.user_id } });
        await handleUserActions({
          Action: 'dhb0003',
          Data: {
            dashboard_id: 0,
            created_userid: appUser.user_id,
            database_name: defaultDb?.name || '',
          },
        });
      } catch (e) {
        // non-fatal, still proceed
        console.error('Bootstrap actions failed', e);
      }
    }

    // 7) success notify + proceed
    ENotify('success', `Welcome ${appUser.username}!`);
    try { handleConnect(); } catch {}

    // 8) fallback redirect if still on login routes
    setTimeout(() => {
      const onLogin = new Set(['', '/', '/login', '/signin']);
      if (onLogin.has(window.location.pathname)) {
        window.location.replace('/dashboard');
      }
    }, 0);
  };

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
              // 1) ensure user exists (public route)
              await dashApiInstance.post(
                EMAIL_SIGNIN,
                { email: gEmail, source: 'google' },
                { headers: { Authorization: '' } }
              );

              // 2) login to get app user object
              const loginRes = await dashApiInstance.post(
                ADMIN_LOGIN,
                { username: gEmail },
                { headers: { Authorization: '' } }
              );

              await postLoginBootstrap(loginRes.data, gEmail);
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
  }, [clientId, buttonContainerId, ADMIN_LOGIN, EMAIL_SIGNIN, dispatch, handleConnect]);

  return {};
};

export default useGoogleAuth;
