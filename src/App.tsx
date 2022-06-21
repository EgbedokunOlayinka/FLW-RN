import React from 'react';
import { AppProvider } from './context/AppContext';
import AppNavigation from './navigation/AppNavigation';

const App = () => {
  return (
    <AppProvider>
      <AppNavigation />
    </AppProvider>
  );
};

export default App;
