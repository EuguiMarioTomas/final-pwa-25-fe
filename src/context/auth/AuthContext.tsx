import type {User} from 'firebase/auth';

export interface AuthContextProps {
  currentUser: User | null;
  userLoggedIn: boolean;
}

import {createContext} from 'react';

export const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  userLoggedIn: false,
});