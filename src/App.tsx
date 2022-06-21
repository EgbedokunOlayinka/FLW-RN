import React from 'react';
import { AppProvider } from './context/AppContext';
import AppNavigation from './navigation/AppNavigation';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <AppProvider>
      <AppNavigation />
      <Toast visibilityTime={3000} />
    </AppProvider>
  );
};

export default App;
