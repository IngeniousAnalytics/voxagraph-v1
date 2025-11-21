import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import {
  Button,
  Group,
  InputWrapper,
  Modal,
  Select,
  Text,
} from '@mantine/core';
import { IConnectDB } from 'src/types';
import { useAppSelector } from 'src/redux/hooks';
console.log("SELECT SOURCE:", Select?.displayName || Select?.name, Select);
const schema = Yup.object().shape({
  db_type_id: Yup.string().required('Required.'),
});

const SwitchDB = ({
  show,
  setShow,
  onSubmit,
  setShowConnectDB,
  I_PERMIT,
}: IConnectDB) => {
  const { dbConnectionResp } = useAppSelector(
    (state: any) => state.dashboardServices
  );

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      db_type_id: '',
    },
  });

  return (
    <Modal
      centered
      size="lg"
      className="search-modal"
      title={
        <Text fw={700} size="xl">
          Connect to Database
        </Text>
      }
      opened={show}
      onClose={() => setShow(false)}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <div className="connect-db-form">
          <InputWrapper label="Domain Type" required>
          <Select
            placeholder="Select a database type"
            data={
              dbConnectionResp.map((item: any) => ({
                value: item?.db_id.toString(),
                label: item?.name,
              })) || []
            }
            
           // comboboxProps={{ withinPortal: false }}   // ✅ Correct fix for v7
            {...form.getInputProps('db_type_id')}
            disabled={!I_PERMIT.i_change_db}
          />

          </InputWrapper>
        </div>

        <Group mt={30}>
          <Button type="submit" disabled={!I_PERMIT.i_change_db}>
            Update DB
          </Button>
          <Button
            color="blue"
            onClick={() => {
              setShowConnectDB && setShowConnectDB(true);
              // defer closing this modal to next frame to avoid synchronous layout
              // mutations that can trigger ResizeObserver loop errors in Mantine
              requestAnimationFrame(() => setShow(false));
            }}
            disabled={!I_PERMIT.i_connect_db}
          >
            Connect New DB
          </Button>
          <Button color="red" onClick={() => requestAnimationFrame(() => setShow(false))}>
            Cancel
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default SwitchDB;
