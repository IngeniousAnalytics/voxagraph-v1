// src/pages/Login/index.tsx
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Group,
  InputWrapper,
  Image,
  Space,
  Anchor,
  Divider,
} from '@mantine/core';
import { useState } from 'react';
import { ILogin } from 'src/types';
import useLogin from './hooks/useLogin';
import useRegistration from './hooks/useRegistration';
import useGoogleAuth from './hooks/useGoogleAuth';
import './index.scss';

// small helper to read env from process.env or window.*
const env = (k: string): string =>
  ((typeof process !== 'undefined' && (process as any).env && (process as any).env[k]) ||
    (typeof window !== 'undefined' && (window as any)[k]) ||
    '') as string;

// preferred keys:
//  - REACT_APP_GOOGLE_CLIENT_ID_DEV / REACT_APP_GOOGLE_CLIENT_ID_PROD (optional split)
//  - REACT_APP_GOOGLE_CLIENT_ID (single id for all)
//  - NX_GOOGLE_CLIENT_ID (if you use NX_* prefix)
const isDevHost =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1';

const CLIENT_ID =
  (isDevHost
    ? env('REACT_APP_GOOGLE_CLIENT_ID_DEV') || env('NX_GOOGLE_CLIENT_ID_DEV')
    : env('REACT_APP_GOOGLE_CLIENT_ID_PROD') || env('NX_GOOGLE_CLIENT_ID_PROD')) ||
  env('REACT_APP_GOOGLE_CLIENT_ID') ||
  env('NX_GOOGLE_CLIENT_ID'); // final fallback

const Login = ({ handleConnect }: ILogin) => {
  const [mode, setMode] = useState<'signin' | 'registration'>('signin');

  // Sign In (your existing hook)
  const { handleUserLogin, form: loginForm } = useLogin(handleConnect);

  // Registration (email-only) – switches back to Sign In on success
  const { handleEmailRegistration, form: regForm } = useRegistration(() => {
    setMode('signin');
  });

  // Google Sign-In using client id from .env (or window fallback)
  useGoogleAuth(handleConnect, {
    clientId: CLIENT_ID,
    buttonContainerId: 'g_id_signin',
  });

  return (
    <div className="login-container">
      <div className="login-card">
        <form
          onSubmit={
            mode === 'signin'
              ? loginForm.onSubmit((values) => handleUserLogin(values))
              : regForm.onSubmit((values) => handleEmailRegistration(values as any))
          }
          className="login-left"
        >
          <div className="login-form">
            <Title order={2} className="login-title">
              {mode === 'signin' ? 'Sign In' : 'Registration'}
            </Title>

            {mode === 'signin' ? (
              <>
                <InputWrapper label="Username/Email" required>
                  <TextInput
                    placeholder="Enter username"
                    maxLength={30}
                    {...loginForm.getInputProps('username')}
                  />
                </InputWrapper>

                <InputWrapper label="Password" required>
                  <PasswordInput
                    placeholder="Enter password"
                    maxLength={128}
                    {...loginForm.getInputProps('password')}
                  />
                </InputWrapper>

                <Group grow mt={20}>
                  <Button type="submit">Login</Button>
                </Group>

                {/* Divider ONLY in Sign In */}
                <Divider my="lg" label="or" labelPosition="center" />
              </>
            ) : (
              <>
                <InputWrapper label="Email" required>
                  <TextInput
                    placeholder="Enter email"
                    maxLength={120}
                    {...regForm.getInputProps('email')}
                  />
                </InputWrapper>

                <Group grow mt={16}>
                  <Button type="submit">Submit</Button>
                </Group>
                {/* No Divider in Registration */}
              </>
            )}

            {/* Keep Google mount point ALWAYS in the DOM; just hide during Registration */}
            <div
              id="g_id_signin"
              style={{
                display: mode === 'signin' ? 'flex' : 'none',
                justifyContent: 'center',
              }}
            />

            <Text size="sm" mt="md" ta="center">
              {mode === 'signin' ? (
                <>
                  New here?{' '}
                  <Anchor onClick={() => setMode('registration')}>Registration</Anchor>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <Anchor onClick={() => setMode('signin')}>Sign in</Anchor>
                </>
              )}
            </Text>
          </div>
        </form>

        <div className="login-right">
          <Image src={'./../../assets/img/logo.svg'} w={240} alt="Voxagraph logo" />
          <Space h={30} />
          <Title order={2}>{mode === 'signin' ? '' : ''}</Title>
          <Text>
            {mode === 'signin'
              ? 'Empowering Decision-Makers. Turn questions into smart analytics.'
              : 'Empowering Decision-Makers. Turn questions into smart analytics.'}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
