// src/pages/Login/hooks/useRegistration.ts
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { ENotify } from '@ai-dashboard/ui';
import { useAppDispatch } from 'src/redux/hooks';
import { setLoader } from 'src/services';
import { dashApiInstance } from 'src/services/instance';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email address.')
    .required('Email is required.'),
});

const useRegistration = (onDone?: () => void) => {
  const dispatch = useAppDispatch();

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: { email: '' },
  });

  const handleEmailRegistration = async (values: { email: string }) => {
    dispatch(setLoader(true));
    try {
      await dashApiInstance.post(
        '/emailregisteration/email-signin/',
        { email: values.email, source: 'registration' }, // 👈 add source
        { headers: { Authorization: '' } }
      );
      ENotify('success', 'Registration link sent to your email (if valid).');
      onDone?.(); // e.g., switch back to Sign In
    } catch (error: any) {
      ENotify('warning', error?.response?.data?.detail || error?.message || 'Registration failed.');
    } finally {
      dispatch(setLoader(false));
    }
  };

  return { form, handleEmailRegistration };
};

export default useRegistration;
