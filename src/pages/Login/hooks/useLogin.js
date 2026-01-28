// src/pages/Login/hooks/useLogin.js

import { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../../../shared/contexts/AuthContext';
import { LOGIN_MESSAGES } from '../constants';

export function useLogin() {
  const [loginField, setLoginField] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      await login({ loginField, password });
      enqueueSnackbar(LOGIN_MESSAGES.SUCCESS, { variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [loginField, password, login, enqueueSnackbar, navigate]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!loading) handleSubmit();
      }
    },
    [handleSubmit, loading]
  );

  return {
    loginField,
    setLoginField,
    password,
    setPassword,
    loading,
    handleSubmit,
    handleKeyDown,
  };
}
