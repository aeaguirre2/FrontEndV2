import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import ToastContainer from './components/ui/ToastContainer';
import { useAuthStore } from './contexts/AuthContext';

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Inicializar autenticación al cargar la app
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <div className="App">
        <AppRoutes />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
