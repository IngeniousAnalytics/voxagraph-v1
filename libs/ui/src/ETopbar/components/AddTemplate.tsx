import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { Button, Modal, TextInput } from '@mantine/core';
import './AddTemplate.scss';

interface IAddTemplate {
  show: boolean;
  setShow: (x: boolean) => void;
  allTemplates: any;
  onSubmit: (values: any) => void;
}

const schema = Yup.object().shape({
  template_name: Yup.string().required('Template name is required.'),
});

const AddTemplate = ({
  show,
  setShow,
  allTemplates,
  onSubmit,
}: IAddTemplate) => {
  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      template_name: '',
    },
  });

  return (
    <Modal
      centered
      size="lg"
      className="search-modal"
      title="Add a Suitable Name to Your Template"
      opened={show}
      onClose={() => setShow(false)}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="modal-content">
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
          <div className="text-input-container">
            <TextInput
              placeholder="Name your template"
              {...form.getInputProps('template_name')}
              onChange={(e) => {
                const rawValue = e.currentTarget.value;
                const value = rawValue.trim();

                form.setFieldValue('template_name', rawValue);

                const templates =
                  allTemplates?.map((each: any) =>
                    each.dashboard_name?.toLowerCase().trim()
                  ) || [];

                if (templates.includes(value.toLowerCase())) {
                  form.setFieldError(
                    'template_name',
                    'This template name already exists'
                  );
                } else {
                  form.clearFieldError('template_name');
                }
              }}
            />
          </div>

          <div className="button-container">
            <Button type="submit">Submit</Button>
            <Button variant="light" color="red" onClick={() => setShow(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddTemplate;
