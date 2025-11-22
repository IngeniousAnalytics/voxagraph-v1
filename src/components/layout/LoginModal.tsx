// src/components/layout/LoginModal.tsx
import { useState } from 'react';
import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Group,
  InputWrapper,
  Divider,
  Anchor,
} from '@mantine/core';
import useLogin from '../../pages/Login/hooks/useLogin';
import useRegistration from '../../pages/Login/hooks/useRegistration';
import useGoogleAuth from '../../pages/Login/hooks/useGoogleAuth';

interface LoginModalProps {
  opened: boolean;
  onClose: () => void;
  handleConnect: () => void;
}

export function LoginModal({ opened, onClose, handleConnect }: LoginModalProps) {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "MISSING_CLIENT_ID";
  useGoogleAuth(handleConnect, { clientId, buttonContainerId: "g_id_signin_modal" });

  const [mode, setMode] = useState<"signin" | "registration">("signin");
  const { handleUserLogin, form: loginForm } = useLogin(handleConnect);
  const { handleEmailRegistration, form: regForm } = useRegistration(() => setMode('signin'));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<span style={{ fontWeight: 'bold', fontSize: '18px' }}>{mode === 'signin' ? 'Sign In' : 'Registration'}</span>}
      centered={false}
      size="lg"
      radius="lg"
      styles={{
        overlay: { position: 'fixed', top: 0, left: 0 },
        inner: { display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', paddingTop: '20px', paddingRight: '20px' },
        content: { fontWeight: 500, width: '100%', maxWidth: '500px' },
        title: { fontWeight: 'bold', fontSize: '18px' },
      }}
    >
      <form
        onSubmit={
          mode === 'signin'
            ? loginForm.onSubmit((values) => {
                handleUserLogin(values);
                onClose();
              })
            : regForm.onSubmit((values) => {
                handleEmailRegistration(values as any);
              })
        }
      >
        {mode === 'signin' ? (
          <>
            <InputWrapper label="Username/Email" required>
              <TextInput
                placeholder="Enter username"
                maxLength={30}
                {...loginForm.getInputProps('username')}
              />
            </InputWrapper>

            <InputWrapper label="Password" required mt="md">
              <PasswordInput
                placeholder="Enter password"
                maxLength={128}
                {...loginForm.getInputProps('password')}
              />
            </InputWrapper>

            <Group grow mt={20}>
              <Button type="submit" fullWidth>
                Login
              </Button>
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
              <Button type="submit" fullWidth>
                Submit
              </Button>
            </Group>
          </>
        )}

        <div
          id="g_id_signin_modal"
          style={{
            display: mode === 'signin' ? 'flex' : 'none',
            justifyContent: 'center',
            marginTop: '16px',
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
      </form>
    </Modal>
  );
}

export default LoginModal;
