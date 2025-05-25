import { Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
      <AuthProvider>
        <div>
          <Outlet />
        </div>
      </AuthProvider>
  );
}