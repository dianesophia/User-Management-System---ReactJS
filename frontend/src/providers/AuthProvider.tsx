import type { AuthUser } from "@/features/auth/types";
import { useNotification } from "@/hooks";
import { axios } from "@/lib/axios";
import { clearStorageValues, getToken } from "@/utils/persistToken";
import storage from "@/utils/storage";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

type AuthState = {
  isLoggedIn: boolean;
  user: AuthUser | null;
}

type AuthAction = 
| { type: 'LOGIN_SUCCESS', user: AuthUser }
| { type: 'LOGOUT_SUCCESS' }

type AuthContextType = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  logout: () => void;
  dispatch: React.Dispatch<AuthAction>;
  authSucess: (user: AuthUser) => Promise<void>;
}

export const AuthConext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch(action.type) {
    case 'LOGIN_SUCCESS': 
      return { ...state, isLoggedIn: true, user: action.user};
    case 'LOGOUT_SUCCESS': 
      return { ...state, isLoggedIn: false, user: null };
    default: 
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, {
    isLoggedIn: !!getToken().token || !!getToken().refresh_token,
    user: null,
  });
  const notification = useNotification();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fetchAuthUser = async () => {
    const token = storage.getValue('token');
    if(!token){
      navigate('/auth/login', { replace: true });
      return null;
    } 

    const response = await axios.get('/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data.data as AuthUser;
  }

  React.useEffect(() => {
    const initializeAuth = async () => {
      const token = storage.getValue('token');

      if(!token){
        navigate('/auth/login', { replace: true });
        return null;
      }

      try {
        const user = await fetchAuthUser();
        if(user){
          dispatch({ type: 'LOGIN_SUCCESS', user });
        } else {
          storage.clearValue('token');
          storage.clearValue('refresh-token');
        };
      } catch {
        storage.clearValue('token');
        storage.clearValue('refresh-token');
      }
    };

    initializeAuth();
  }, []);

  const logout = React.useCallback(() => {
    clearStorageValues();
    localStorage.removeItem('redirect-path');
    dispatch({ type: 'LOGOUT_SUCCESS' });
    queryClient.clear();
    notification.show({
      title: "Logout successful",
      message: "User logged out",
      type: 'success',
    });
    navigate('/auth/login', { replace: true });
  }, [navigate, notification, queryClient]);

  const authSucess = React.useCallback(async (user: AuthUser) => {
    dispatch({ type: 'LOGIN_SUCCESS', user });
  }, []);

  const value = React.useMemo(
    () => ({
      isLoggedIn: state.isLoggedIn,
      user: state.user,
      logout,
      dispatch,
      authSucess
    }),
    [authSucess, logout, state]
  );

  return <AuthConext.Provider value={value}>{ children }</AuthConext.Provider>
};

export const useAuth = () => {
  const context = React.useContext(AuthConext);
  if(!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}