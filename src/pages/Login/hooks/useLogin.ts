//src/pages/login/hooks/useLogin.ts
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { ENotify } from '@ai-dashboard/ui';
import { useAppDispatch } from 'src/redux/hooks';
import { userLogin, setLoader } from 'src/services';

const schema = Yup.object().shape({
  username: Yup.string().required('Username is required.'),
  password: Yup.string().required('Password is required.'),
});

const useLogin = (handleConnect: () => void) => {
  const dispatch = useAppDispatch();

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleUserLogin = async (values: any) => {
    dispatch(setLoader(true));

    try {
      await dispatch(userLogin(values)).unwrap();
      ENotify('success', 'User logged in successfully.');
      handleConnect();
    } catch (error: any) {
      ENotify('warning', error?.message || 'Invalid Login Credentials.');
    } finally {
      dispatch(setLoader(false));
    }
  };

  return { handleUserLogin, form };
};

export default useLogin;
