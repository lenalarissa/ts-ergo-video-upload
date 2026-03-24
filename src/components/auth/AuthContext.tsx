import { createContext } from "react";
import type { User } from "eqmod-ts-userlogin";

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
