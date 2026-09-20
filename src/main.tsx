import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Homepage from './pages/Homepage';
import Home from './pages/Home';
import './index.css';

const queryClient = new QueryClient();

function App() {
  const [showSimulator, setShowSimulator] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      {showSimulator ? (
        <Home onBackToHomepage={() => setShowSimulator(false)} />
      ) : (
        <Homepage onStartSimulation={() => setShowSimulator(true)} />
      )}
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);