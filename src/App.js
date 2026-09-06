// src/App.jsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './shared/contexts/AuthContext';
import { ImageLightboxProvider } from './shared/components/ImageLightbox';
import AppRoutes from './AppRoutes';

export default function App() {
  return (
    <SnackbarProvider 
      maxSnack={3} 
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      style={{ zIndex: 99999 }}
    >
      <AuthProvider>
        <ImageLightboxProvider>
          <BrowserRouter basename="/forbidden">
            <AppRoutes />
          </BrowserRouter>
        </ImageLightboxProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}
