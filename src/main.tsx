// src/main.tsx
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { store } from './redux/store';
import App from './App';

// Mantine styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// Your global styles
import './assets/styles/grid.css';
import './_mixins.scss';
import './styles.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider defaultColorScheme="light">
        {/* optional global notifications support */}
        <Notifications position="top-right" zIndex={2077} />
        <App />
      </MantineProvider>
    </Provider>
  </StrictMode>
);
