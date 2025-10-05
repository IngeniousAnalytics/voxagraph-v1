import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { Button, Modal, Textarea } from '@mantine/core';
import { IAddQuery } from 'src/types';
import '../styles/addQuery.scss';

const schema = Yup.object().shape({
  query: Yup.string().required('Please enter a valid SQL Query.'),
});

const AddQuery = ({
  show,
  setShow,
  jsonArray,
  onSubmit,
  I_PERMIT,
}: IAddQuery) => {
  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      query: jsonArray.query,
    },
  });
  return (
    <Modal
      centered
      size="lg"
      className="search-modal"
      title="Add / Edit a valid SQL Query to plot the graph"
      opened={show}
      onClose={() => setShow(false)}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="modal-content">
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
          <div className="text-input-container">
            <Textarea
              resize="vertical"
              placeholder="Add your SQL Query"
              {...form.getInputProps('query')}
              autosize
              maxRows={10}
              readOnly={!I_PERMIT?.i_query}
            />
          </div>

          <div className="button-container">
            <Button type="submit" disabled={!I_PERMIT?.i_query}>
              Submit
            </Button>
            <Button variant="light" color="red" onClick={() => setShow(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddQuery;
