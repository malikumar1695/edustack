import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { defaultUser } from "../mocks/user";

export type CurrentUser = {
  name?: string;
  avatar?: string;
  userid?: string;
  email?: string;
  signature?: string;
  title?: string;
  group?: string;
  tags?: { key?: string; label?: string }[];
  notifyCount?: number;
  unreadCount?: number;
  country?: string;
  access?: string;
  geographic?: {
    province?: { label?: string; key?: string };
    city?: { label?: string; key?: string };
  };
  address?: string;
  phone?: string;
};

export type LoginResult = {
  status?: "ok" | "error";
  type?: string;
  currentAuthority?: string;
};

const ACCESS_KEY = "ilm-admin-access";

/**
 * Ported from ant-design-pro-master's mock/user.ts, which kept a
 * module-level `access` variable on a fake Express server to simulate a
 * session. There's no server here, so the same state just lives in
 * localStorage instead — same login rules (admin/user + ant.design,
 * mobile always succeeds), same 2s delay, no real backend involved.
 */
async function fakeLogin(
  username: string | undefined,
  password: string | undefined,
  type: string | undefined,
): Promise<LoginResult> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (password === "ant.design" && username === "admin") {
    localStorage.setItem(ACCESS_KEY, "admin");
    return { status: "ok", type, currentAuthority: "admin" };
  }
  if (password === "ant.design" && username === "user") {
    localStorage.setItem(ACCESS_KEY, "user");
    return { status: "ok", type, currentAuthority: "user" };
  }
  if (type === "mobile") {
    localStorage.setItem(ACCESS_KEY, "admin");
    return { status: "ok", type, currentAuthority: "admin" };
  }

  localStorage.setItem(ACCESS_KEY, "guest");
  return { status: "error", type, currentAuthority: "guest" };
}

function readCurrentUser(): CurrentUser | undefined {
  const access = localStorage.getItem(ACCESS_KEY);
  if (!access) return undefined;
  return { ...defaultUser, access };
}

type AuthContextValue = {
  currentUser: CurrentUser | undefined;
  loading: boolean;
  login: (
    username: string,
    password: string,
    type: string,
  ) => Promise<LoginResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentUser(readCurrentUser());
    setLoading(false);
  }, []);

  const login = useCallback(
    async (username: string, password: string, type: string) => {
      const result = await fakeLogin(username, password, type);
      setCurrentUser(readCurrentUser());
      return result;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_KEY);
    setCurrentUser(undefined);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
