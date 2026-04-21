import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth    from './pages/Auth';
import Feed    from './pages/Feed';
import Create  from './pages/Create';
import Profile from './pages/Profile';
import People  from './pages/People';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/feed" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={
            <PublicRoute><Auth initialMode="login" /></PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute><Auth initialMode="register" /></PublicRoute>
          } />
          <Route path="/feed" element={
            <ProtectedRoute><Feed /></ProtectedRoute>
          } />
          <Route path="/people" element={
            <ProtectedRoute><People /></ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute><Create /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
