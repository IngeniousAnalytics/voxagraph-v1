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



const Login = ({ handleConnect }: ILogin) => {
  const devClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const prodClientId = 'YOUR_PROD_CLIENT_ID.apps.googleusercontent.com';

  if (
    (location.hostname === 'localhost' || location.hostname === '127.0.0.1') &&
    !devClientId
  ) {
    console.error('Missing REACT_APP_GOOGLE_CLIENT_ID in .env');
    // Or show a UI error, but don't crash the whole app in production
  }

  const clientId =
    location.hostname === 'localhost' || location.hostname === '127.0.0.1'
      ? devClientId || 'MISSING'
      : prodClientId;

  useGoogleAuth(handleConnect, {
    clientId,
    buttonContainerId: 'g_id_signin',
  });

  const [mode, setMode] = useState<'signin' | 'registration'>('signin');
  // Sign In (existing hook)
  const { handleUserLogin, form: loginForm } = useLogin(handleConnect);

  // Registration (email-only)
  const { handleEmailRegistration, form: regForm } = useRegistration(() => {
    setMode('signin');
  });



  return (
    <div className="login-container">
      <div className="login-card">
        <form
          onSubmit={
            mode === 'signin'
              ? loginForm.onSubmit((values) => handleUserLogin(values))
              : regForm.onSubmit((values) =>
                  handleEmailRegistration(values as any)
                )
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
              </>
            )}

            {/* Keep Google Sign-In mount point always in DOM */}
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
                  <Anchor onClick={() => setMode('registration')}>
                    Registration
                  </Anchor>
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
          <Image
            src={'./../../assets/img/logo.svg'}
            w={240}
            alt="Voxagraph logo"
          />
          <Space h={30} />
          <Title order={2}></Title>
          <Text>
            Empowering Decision-Makers. Turn questions into smart analytics.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
