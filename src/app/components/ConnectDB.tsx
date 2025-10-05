import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import {
  Button,
  Group,
  InputWrapper,
  Modal,
  Select,
  TextInput,
  Text,
} from '@mantine/core';
import { IConnectDB } from 'src/types';

const schema = Yup.object().shape({
  connection_name: Yup.string().required('Connection name is required.'),
  db_name: Yup.string().required('Databse name is required.'),
  db_type: Yup.string().required('Database type is required.'),
  host: Yup.string().required('Host name is required.'),
  port: Yup.string().required('Port number is required.'),
  db_username: Yup.string().required('DB username is required.'),
  db_password: Yup.string().required('DB password is required.'),
});

export const ConnectDB = ({
  show,
  setShow,
  onSubmit,
  I_PERMIT,
}: IConnectDB) => {
  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      connection_name: '',
      db_name: '',
      db_type: '',
      host: '',
      port: '',
      db_username: '',
      db_password: '',
    },
  });

  return (
    <Modal
      centered
      size="lg"
      className="search-modal"
      title={
        <Text fw={700} size="xl">
          Connect to Database{' '}
          <span style={{ color: 'red', fontSize: 13, fontWeight: 600 }}>
            (Please use only read only credential)
          </span>
        </Text>
      }
      opened={show}
      onClose={() => setShow(false)}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <div className="connect-db-form">
          <InputWrapper label="Connection Name" required>
            <TextInput
              placeholder="Enter a suitable name to your connection"
              maxLength={40}
              {...form.getInputProps('connection_name')}
            />
          </InputWrapper>

          <InputWrapper label="RDBMS Type" required>
            <Select
              placeholder="Select a database type"
              data={['mysql', 'mssql', 'postgresql']}
              {...form.getInputProps('db_type')}
            />
          </InputWrapper>

          <InputWrapper label="Databse Name" required>
            <TextInput
              placeholder="Enter database name"
              maxLength={50}
              {...form.getInputProps('db_name')}
            />
          </InputWrapper>

          <InputWrapper label="Host" required>
            <TextInput
              placeholder="Enter host name"
              maxLength={30}
              {...form.getInputProps('host')}
            />
          </InputWrapper>

          <InputWrapper label="Port" required>
            <TextInput
              placeholder="Enter port number"
              maxLength={20}
              {...form.getInputProps('port')}
            />
          </InputWrapper>

          <InputWrapper label="Username" required>
            <TextInput
              placeholder="Enter db username"
              maxLength={20}
              {...form.getInputProps('db_username')}
            />
          </InputWrapper>

          <InputWrapper label="Password" required>
            <TextInput
              placeholder="Enter db password"
              type="password"
              maxLength={15}
              {...form.getInputProps('db_password')}
            />
          </InputWrapper>
        </div>

        <Group mt={30}>
          <Button type="submit" disabled={!I_PERMIT.i_connect_db}>
            Connect Now
          </Button>
          <Button color="red" onClick={() => setShow(!show)}>
            Cancel
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default ConnectDB;
