import { Button, ColorPicker, Modal, Text } from '@mantine/core';
import './index.scss';

interface IEColorPicker {
  show: boolean;
  setShow: (x: boolean) => void;
  value: string;
  onChange: any;
}

export const EColorPicker = ({
  show,
  setShow,
  value,
  onChange,
}: IEColorPicker) => {
  const defaultColors = [
    '#2e2e2e',
    '#868e96',
    '#fa5252',
    '#e64980',
    '#be4bdb',
    '#7950f2',
    '#4c6ef5',
    '#228be6',
    '#15aabf',
    '#12b886',
    '#40c057',
    '#82c91e',
    '#fab005',
    '#fd7e14',
  ];

  return (
    <Modal
      centered
      size="md"
      className="search-modal"
      title={<Text>Choose a suitable color</Text>}
      opened={show}
      onClose={() => setShow(false)}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <ColorPicker
        fullWidth
        value={value}
        onChange={onChange}
        swatches={defaultColors}
        format="rgba"
      />

      <div className="items-wrapper">
        <Text>{value}</Text>
        <Button color="#1abc9c" onClick={() => setShow(false)}>
          Done
        </Button>
      </div>
    </Modal>
  );
};

export default EColorPicker;
