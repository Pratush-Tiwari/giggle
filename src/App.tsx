import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './lib/theme-context';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login/loadable';
import { Signup } from './components/Signup/loadable';
import { NotFound } from './components/NotFound/loadable';
import { Main } from './components/Main/loadable';

const AppRoutes: React.FC = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return (
      <Routes>
        <Route path="/*" element={<Main />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/NotFound" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/NotFound" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;
