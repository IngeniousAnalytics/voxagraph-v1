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
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ILogin } from 'src/types';
import useLogin from './hooks/useLogin';
import useRegistration from './hooks/useRegistration';
import useGoogleAuth from './hooks/useGoogleAuth';
import AppLayout from '../../components/layout/AppLayout';
import './index.scss';

const Login = ({ handleConnect }: ILogin) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "MISSING_CLIENT_ID";
  useGoogleAuth(handleConnect, { clientId, buttonContainerId: "g_id_signin" });

  const location = useLocation();

  // ✅ Parse mode before first render
  const queryParams = new URLSearchParams(location.search);
  const initialMode =
    queryParams.get("mode") === "registration" ? "registration" : "signin";

  const [mode, setMode] = useState<"signin" | "registration">(initialMode);

  useEffect(() => {
    const paramMode =
      new URLSearchParams(location.search).get("mode") === "registration"
        ? "registration"
        : "signin";
    setMode(paramMode);
  }, [location.search]);

 
  const { handleUserLogin, form: loginForm } = useLogin(handleConnect);
  const { handleEmailRegistration, form: regForm } = useRegistration(() => setMode('signin'));



  return (
    <>
    <AppLayout> {/* ✅ shared Header & Footer auto applied */}
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
            <Image src={'./../../assets/img/logo.svg'} w={240} alt="Voxagraph logo" />
            <Space h={30} />
            <Title order={2}></Title>
            <Text>Empowering Decision-Makers. Turn questions into smart analytics.</Text>
          </div>
        </div>
      </div>

    </AppLayout>
    </>
  );
};

export default Login;
