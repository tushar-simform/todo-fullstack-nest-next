export const ROUTES = {
  home: "/",
  login: "/login",
  today: "/today",
  all: "/all",
  due: "/due",
  upcoming: "/upcoming",
  done: "/done",
  settings: "/settings",
} as const;

/** be-todo API paths (relative to API_URL). */
export const API_PATHS = {
  login: "/auth/login",
  me: "/auth/me",
  todos: "/todos",
  todo: (id: string) => `/todos/${id}`,
  completion: (id: string, date: string) => `/todos/${id}/completions/${date}`,
} as const;

/** Reachable without signing in. Everything else is protected by `proxy.ts`. */
export const PUBLIC_ROUTES: string[] = [ROUTES.home, ROUTES.login];
