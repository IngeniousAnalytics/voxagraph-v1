import { useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { Button, Modal, TextInput } from '@mantine/core';
import { FiMic } from 'react-icons/fi';
import { BsStopCircle } from 'react-icons/bs';
import { ISearchQuestion } from 'src/types';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { setLoader } from 'src/services';
import { useAppDispatch } from 'src/redux/hooks';
import '../styles/searchQuestion.scss';

const schema = Yup.object().shape({
  question: Yup.string().required('Please enter a question.'),
});

const SearchQuestion = ({
  show,
  setShow,
  onSubmit,
  jsonArray,
  I_PERMIT,
}: ISearchQuestion) => {
  const { transcript, isListening, startListening, stopListening } =
    useSpeechToText();
  const dispatch = useAppDispatch();
  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      question: jsonArray.questions,
    },
  });

  useEffect(() => {
    if (transcript && isListening) {
      form.setFieldValue('question', transcript);
      stopListening();
    }
  }, [transcript, isListening]);

  return (
    <Modal
      centered
      size="lg"
      className="search-modal"
      title="Search your question to plot the graph"
      opened={show}
      onClose={() => {
        setShow(false);
        dispatch(setLoader(false));
      }}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="modal-content">
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
          <div className="text-input-container">
            <TextInput
              placeholder="Ask anything"
              {...form.getInputProps('question')}
              readOnly={!I_PERMIT.i_question}
            />
            {I_PERMIT.i_question && (
              <div className="send-button">
                {isListening ? (
                  <BsStopCircle
                    color="red"
                    size={20}
                    onClick={() => {
                      form.setFieldValue('question', transcript);
                      stopListening();
                    }}
                  />
                ) : (
                  <FiMic
                    color="gray"
                    size={20}
                    onClick={() => startListening(7000)}
                  />
                )}
              </div>
            )}
          </div>

          <div className="button-container">
            <Button type="submit" disabled={!I_PERMIT.i_question}>
              Confirm
            </Button>
            <Button
              variant="light"
              color="red"
              onClick={() => {
                setShow(false);
                dispatch(setLoader(false));
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SearchQuestion;
