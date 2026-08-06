import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { defaultUser } from "../mocks/user";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../services/api";
import { getApiErrorMessage } from "../services/errors";
import { logger } from "../lib/logger";

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
  message?: string;
};

type AccessTokenClaims = {
  sub: string;
  username: string;
  roles: string[];
  exp: number;
}

const ACCESS_KEY = "edustack-admin-access";

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

const readCurrentUser = (): CurrentUser | undefined => {
  const access = localStorage.getItem(ACCESS_KEY);
  if (!access) return undefined;

  try {
    const claims = jwtDecode<AccessTokenClaims>(access);
    if (claims.exp * 1000 < Date.now()) {

      localStorage.removeItem(ACCESS_KEY);
      return undefined;
    }
    return {
      ...defaultUser,
      userid: claims.sub,
      name: claims.username,
      access: claims.roles[0],
    };
  } catch (error) {
    localStorage.removeItem(ACCESS_KEY);
    return undefined;
  }
};

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
    async (username: string, password: string, type: string): Promise<LoginResult> => {
      try {
        const { data } = await authApi.post<{ accessToken: string }>("/auth/login",
          { username, password }
        );

        localStorage.setItem(ACCESS_KEY, data.accessToken);
        const user = readCurrentUser();
        setCurrentUser(user);
        logger.info("login success", { userid: user?.userid });
        return { status: "ok", type, currentAuthority: user?.access };
      } catch (error) {
        logger.warn("login failed", { message: getApiErrorMessage(error) });
        return { status: "error", type, currentAuthority: "guest", message: getApiErrorMessage(error) };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.post("/auth/logout");
       logger.info("logout succeeded");
    } catch {

    }
    finally {
      localStorage.removeItem(ACCESS_KEY);
      setCurrentUser(undefined);
    }
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
