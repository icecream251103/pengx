import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Web3Provider } from './contexts/Web3Context';
import { SandboxProvider } from './contexts/SandboxContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import ProtectedRoute from './components/ProtectedRoute';
import App from './App.tsx';
import Dashboard from './pages/Dashboard.tsx';
import KYC from './pages/KYC.tsx';
import PentaLend from './pages/PentaLend.tsx';
import Whitepaper from './pages/Whitepaper.tsx';
import DatabaseDemo from './components/DatabaseDemo.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <DatabaseProvider>
        <Web3Provider>
          <SandboxProvider>
            <Router>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/whitepaper" element={<Whitepaper />} />
              <Route 
                path="/kyc" 
                element={
                  <ProtectedRoute requireWallet={true} requireKYC={false}>
                    <KYC />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requireWallet={true} requireKYC={true}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pentalend" 
                element={
                  <ProtectedRoute requireWallet={true} requireKYC={true}>
                    <PentaLend />
                  </ProtectedRoute>
                } 
              />
              <Route path="/db-demo" element={<DatabaseDemo />} />
            </Routes>
          </Router>
        </SandboxProvider>
      </Web3Provider>
      </DatabaseProvider>
    </ThemeProvider>
  </StrictMode>
);