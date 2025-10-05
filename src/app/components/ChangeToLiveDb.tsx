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

import { useAppSelector } from 'src/redux/hooks';

const schema = Yup.object().shape({
  db_type_id: Yup.string().required('Required.'),
});

const ChangeToLiveDb = ({
  opened,
  onClose,
  onSubmit,
  setShowConnectDB,
  I_PERMIT,
}: any) => {
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
          Move To Database
        </Text>
      }
      opened={opened}
      onClose={() => onClose.close()}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <form onSubmit={form.onSubmit((values) => onSubmit(values,form))}>
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
              {...form.getInputProps('db_type_id')}
              disabled={!I_PERMIT.i_change_db}
            />
          </InputWrapper>
        </div>

        <Group mt={30}>
          <Button type="submit" disabled={!I_PERMIT.i_change_db}>
            Submit
          </Button>
          <Button color="red" onClick={() => onClose.close()}>
            Cancel
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default ChangeToLiveDb;
