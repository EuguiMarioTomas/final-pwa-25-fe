import type {User} from 'firebase/auth';

export interface AuthContextProps {
  currentUser: User | null;
  userLoggedIn: boolean;
  loading: boolean;
}

import {createContext} from 'react';

export const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  userLoggedIn: false,
  loading: true,
});