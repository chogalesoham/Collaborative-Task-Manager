import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useGetMeQuery } from '../store/slices/authApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser, setLoading } from '../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth);
  
  const { data, isLoading, error } = useGetMeQuery();

  useEffect(() => {
    // Hydrate user state from server authentication check
    if (data?.user) {
      dispatch(setUser(data.user));
    } else if (error) {
      dispatch(setUser(null));
    }
    
    if (!isLoading) {
      dispatch(setLoading(false));
    }
  }, [data, error, isLoading, dispatch]);

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Preserve location to redirect back after login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
