import { LoadingOverlay } from '@mantine/core';

interface IELoading {
  loading: boolean;
}

export const ELoading = ({ loading }: IELoading) => {
  return (
    <LoadingOverlay
      visible={loading}
      zIndex={11}
      overlayProps={{ radius: 'sm', blur: 2 }}
    />
  );
};

export default ELoading;
